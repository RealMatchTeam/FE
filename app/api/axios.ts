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

const envBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
const BASE_URL =
  (envBase && envBase.trim().length > 0 ? envBase.trim() : undefined) ??
  (import.meta.env.PROD ? "https://api.realmatch.co.kr" : "/api");

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

const normalizeUrl = (url: string) => {
  let next = url;

  next = next.replace(/^\/api\/api\//, "/api/");

  const isDevProxy = BASE_URL === "/api";

  if (isDevProxy) {
    next = next.replace(/^\/api\/v1\//, "/v1/");
    next = next.replace(/^\/api\/api\/v1\//, "/v1/");
  } else {
    next = next.replace(/^\/v1\//, "/api/v1/");
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
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
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

      // 1. 리프레시 요청 자체가 401이면 즉시 로그아웃
      if (isRefreshRequest(originalRequest.url)) {
        console.error("[Axios Interceptor] Critical: Refresh API returned 401. Clearing tokens and redirecting.");
        tokenStorage.clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return Promise.reject(error);
      }

      // 2. 일반 API 요청이 401인 경우 갱신 시도
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          console.log("[Axios Interceptor] Refresh already in progress, queuing callback.");
          return new Promise((resolve) => {
            subscribeTokenRefresh((token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            });
          });
        }

        isRefreshing = true;
        console.log("[Axios Interceptor] Starting Token Refresh flow...");

        try {
          const refreshToken = tokenStorage.getRefreshToken();
          const accessToken = tokenStorage.getAccessToken();

          if (!refreshToken) {
            console.error("[Axios Interceptor] No Refresh Token found in localStorage.");
            throw new Error("NO_REFRESH_TOKEN");
          }

          const refreshPath = BASE_URL === "/api" ? "/v1/auth/refresh" : "/api/v1/auth/refresh";

          const headers = {
            'accept': '*/*',
            'RefreshToken': refreshToken,
            'Authorization': `Bearer ${accessToken}`,
          };

          const res = await refreshInstance.post<RefreshResponse>(
            refreshPath,
            "",
            {
              headers: headers,
            }
          );

          const { accessToken: newAccess, refreshToken: newRefresh } = res.data.result;
          if (!newAccess || !newRefresh) {
            throw new Error("INVALID_TOKEN_DATA_IN_RESPONSE");
          }

          tokenStorage.setTokens(newAccess, newRefresh);

          isRefreshing = false;
          onTokenRefreshed(newAccess);

          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return axiosInstance(originalRequest);
        } catch (refreshErr: unknown) {
          isRefreshing = false;

          if (axios.isAxiosError(refreshErr)) {
            const status = refreshErr.response?.status;
            console.error(`[Axios Interceptor] Refresh Request Failed (Status: ${status})`);
          }

          tokenStorage.clearTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/auth/login";
          }

          return Promise.reject(refreshErr);
        }
      }
    }

    return Promise.reject(error);
  },
);

export const apiClient = axiosInstance;
