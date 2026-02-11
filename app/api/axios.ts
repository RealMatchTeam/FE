import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { tokenStorage } from "../lib/token";

type RefreshResult = {
  accessToken: string;
  refreshToken: string;
};

type RefreshResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: RefreshResult;
};

// 환경에 따른 BASE_URL 설정
// 1. 운영 환경(PROD)일 때는 .env의 VITE_API_BASE_URL 또는 기본 실서버 주소 사용
// 2. 개발 환경(DEV)일 때는 Vite 로컬 프록시(/api) 사용 (CORS 방지)
const IS_PROD = import.meta.env.PROD === true || import.meta.env.MODE === "production";
const BASE_URL = IS_PROD
  ? (import.meta.env.VITE_API_BASE_URL || "https://api.realmatch.co.kr")
  : "/api";

console.log(`[Axios] Initializing with BASE_URL: ${BASE_URL} (MODE: ${import.meta.env.MODE})`);

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

const normalizeUrl = (url: string) => {
  if (!url || url.startsWith("http")) return url;

  let next = url;

  // 1. /api/api/ 가 이미 들어온 경우 /api/로 교정
  next = next.replace(/^\/api\/api\//, "/api/");

  const isDevProxy = BASE_URL === "/api";

  if (isDevProxy) {
    // 로컬 프록시 사용 시:
    // baseURL이 "/api"로 설정되어 있으므로, config.url에서 "/api"를 제거해야
    // 최종적으로 /api + (/v1/...) 주소가 되어 중복이 발생하지 않습니다.
    if (next.startsWith("/api/")) {
      next = next.substring(4);
    }
  } else {
    // 운영 서버 직접 호출 시:
    // baseURL이 서버 도메인이므로, config.url에 "/api"가 포함되어야 합니다.
    if (next.startsWith("/v1/")) {
      next = "/api" + next;
    }
  }

  return next;
};

const isRefreshRequest = (url?: string) =>
  typeof url === "string" && url.includes("/auth/refresh");

// 토큰 갱신 전용 별도 인스턴스
const refreshInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const url = typeof config.url === "string" ? config.url : "";

    // normalizeUrl은 상대 경로일 때만 유효함
    if (!isRefreshRequest(url) && typeof config.url === "string") {
      config.url = normalizeUrl(config.url);
    }

    const accessToken = tokenStorage.getAccessToken();
    if (accessToken && !isRefreshRequest(url)) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let refreshSubscribers: Array<{
  onSuccess: (token: string) => void;
  onError: (error: unknown) => void;
}> = [];

const subscribeTokenRefresh = (onSuccess: (token: string) => void, onError: (error: unknown) => void) => {
  refreshSubscribers.push({ onSuccess, onError });
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((sub) => sub.onSuccess(token));
  refreshSubscribers = [];
};

const onTokenRefreshFailed = (error: unknown) => {
  refreshSubscribers.forEach((sub) => sub.onError(error));
  refreshSubscribers = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!originalRequest) return Promise.reject(error);

    const status = error.response?.status;

    // 401 Unauthorized 처리
    if (status === 401) {
      console.warn(`[Axios Interceptor] 401 detected for: ${originalRequest.url}`);

      // 1. 리프레시 요청 자체가 401이면 무조건 로그아웃 (무한 루프 방지)
      if (isRefreshRequest(originalRequest.url)) {
        console.error("[Axios Interceptor] Critical: Refresh API returned 401. Clearing tokens and redirecting to login.");
        tokenStorage.clearTokens();
        if (typeof window !== "undefined" && !window.location.pathname.includes("/auth/login")) {
          window.location.href = "/auth/login";
        }
        return Promise.reject(error);
      }

      // 2. 일반 API 요청이 401인 경우 갱신 시도
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          console.log("[Axios Interceptor] Refresh already in progress, queuing callback.");
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh(
              (token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(axiosInstance(originalRequest));
              },
              (err: unknown) => {
                reject(err);
              }
            );
          });
        }

        isRefreshing = true;
        console.log("[Axios Interceptor] Starting Token Refresh flow...");

        try {
          const refreshToken = tokenStorage.getRefreshToken();

          if (!refreshToken) {
            console.error("[Axios Interceptor] No Refresh Token found in localStorage.");
            throw new Error("NO_REFRESH_TOKEN");
          }

          // refreshPath는 직접 구성 (normalizeUrl을 거치지 않음)
          // BASE_URL이 "/api" (dev proxy)인 경우, 이미 baseURL에 "/api"가 포함되어 있으므로
          // 중복을 피하기 위해 "/v1/auth/refresh"만 사용합니다.
          const refreshPath = BASE_URL === "/api" ? "/v1/auth/refresh" : "/api/v1/auth/refresh";

          const headers = {
            'accept': '*/*',
            'RefreshToken': `Bearer ${refreshToken}`,
          };

          const res = await refreshInstance.post<RefreshResponse>(
            refreshPath,
            {},
            {
              headers: headers,
            }
          );

          const { accessToken: newAccess, refreshToken: newRefresh } = res.data?.result || {};
          if (!newAccess || !newRefresh) {
            console.error("[Axios Interceptor] Invalid token data in refresh response:", res.data);
            throw new Error("INVALID_TOKEN_DATA_IN_RESPONSE");
          }

          tokenStorage.setTokens(newAccess, newRefresh);

          isRefreshing = false;
          onTokenRefreshed(newAccess);

          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return axiosInstance(originalRequest);
        } catch (refreshErr: unknown) {
          isRefreshing = false;
          onTokenRefreshFailed(refreshErr);

          console.error("[Axios Interceptor] Refresh Token flow failed:", refreshErr);

          // 리프레시 토큰이 없거나, 서버에서 유효하지 않다고 판단한 경우(401/403)만 로그아웃
          const isAuthError = axios.isAxiosError(refreshErr) &&
            (refreshErr.response?.status === 401 || refreshErr.response?.status === 400);

          if (isAuthError || refreshErr instanceof Error && refreshErr.message === "NO_REFRESH_TOKEN") {
            console.warn("[Axios Interceptor] Session expired or invalid. Clearing tokens.");
            tokenStorage.clearTokens();
            if (typeof window !== "undefined" && !window.location.pathname.includes("/auth/login")) {
              window.location.href = "/auth/login";
            }
          } else {
            console.warn("[Axios Interceptor] Refresh failed due to network or server error. Tokens NOT cleared.");
          }

          return Promise.reject(refreshErr);
        }
      }
    }

    return Promise.reject(error);
  },
);

export const apiClient = axiosInstance;
