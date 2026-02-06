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

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof config.url === "string") {
      config.url = normalizeUrl(config.url);
    }

    const accessToken = tokenStorage.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    console.log("[REQ]", {
      method: config.method,
      baseURL: config.baseURL,
      url: config.url,
      full: `${config.baseURL ?? ""}${config.url ?? ""}`,
    });

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

    if (typeof originalRequest.url === "string") {
      originalRequest.url = normalizeUrl(originalRequest.url);
    }

    if (
      (error.response?.status === 401 || error.response?.status === 400) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) {
          tokenStorage.clearTokens();
          window.location.href = "/auth/login";
          return Promise.reject(error);
        }

        const refreshPath =
          BASE_URL === "/api" ? "/v1/auth/refresh" : "/api/v1/auth/refresh";

        const res = await axiosInstance.post<RefreshResponse>(
          refreshPath,
          {},
          { headers: { RefreshToken: `Bearer ${refreshToken}` } },
        );

        const accessToken = res.data.result?.accessToken;
        const newRefreshToken = res.data.result?.refreshToken;

        if (!accessToken || !newRefreshToken) {
          tokenStorage.clearTokens();
          window.location.href = "/auth/login";
          return Promise.reject(error);
        }

        tokenStorage.setTokens(accessToken, newRefreshToken);
        onTokenRefreshed(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (e) {
        tokenStorage.clearTokens();
        window.location.href = "/auth/login";
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const apiClient = axiosInstance;
