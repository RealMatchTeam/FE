import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { tokenStorage } from "../lib/token";

type RefreshResponse = {
  result?: {
    accessToken: string;
    refreshToken: string;
  };
};

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log("[REQ]", {
      method: config.method,
      baseURL: config.baseURL,
      url: config.url,
      full: `${config.baseURL ?? ""}${config.url ?? ""}`,
    });

    if (typeof config.url === "string") {
      config.url = config.url.replace(/^\/api\/v1\//, "/v1/");
      config.url = config.url.replace(/^\/api\/api\//, "/api/");
    }

    const accessToken = tokenStorage.getAccessToken();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (typeof originalRequest.url === "string") {
      originalRequest.url = originalRequest.url.replace(/^\/api\/v1\//, "/v1/");
      originalRequest.url = originalRequest.url.replace(/^\/api\/api\//, "/api/");
    }

    if (
      (error.response?.status === 401 || error.response?.status === 400) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = tokenStorage.getRefreshToken();

          if (!refreshToken) {
            tokenStorage.clearTokens();
            window.location.href = "/auth/login";
            return Promise.reject(error);
          }

          const response = await axios.post<RefreshResponse>(
            `/api/v1/auth/refresh`,
            {},
            {
              headers: {
                RefreshToken: `Bearer ${refreshToken}`,
              },
            },
          );

          const accessToken = response.data.result?.accessToken;
          const newRefreshToken = response.data.result?.refreshToken;

          if (!accessToken || !newRefreshToken) {
            isRefreshing = false;
            tokenStorage.clearTokens();
            window.location.href = "/auth/login";
            return Promise.reject(error);
          }

          tokenStorage.setTokens(accessToken, newRefreshToken);

          onTokenRefreshed(accessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          isRefreshing = false;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          tokenStorage.clearTokens();
          window.location.href = "/auth/login";
          return Promise.reject(refreshError);
        }
      } else {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(axiosInstance(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  },
);

export const apiClient = axiosInstance;
