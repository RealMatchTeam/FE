import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { tokenStorage } from "../lib/token";

// Axios 인스턴스 생성
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request 인터셉터: Access Token 자동 추가
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = tokenStorage.getAccessToken();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response 인터셉터: 401 에러 시 토큰 갱신
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

    // 400 또는 401 에러이고, 재시도하지 않은 요청인 경우
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
            // Refresh Token이 없으면 로그아웃 처리
            tokenStorage.clearTokens();
            window.location.href = "/auth/login";
            return Promise.reject(error);
          }

          // Refresh Token으로 새 Access Token 발급
          const response = await axios.post(
            `/api/v1/auth/refresh`,
            {},
            {
              headers: {
                RefreshToken: `Bearer ${refreshToken}`,
              },
            },
          );

          const { accessToken, refreshToken: newRefreshToken } =
            response.data.result;

          // 새로운 토큰 저장
          tokenStorage.setTokens(accessToken, newRefreshToken);

          // 대기 중인 요청들에 새 토큰 전달
          onTokenRefreshed(accessToken);

          // 원래 요청 재시도
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          isRefreshing = false;

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh Token도 만료된 경우 로그아웃 처리
          isRefreshing = false;
          tokenStorage.clearTokens();
          window.location.href = "/auth/login";
          return Promise.reject(refreshError);
        }
      } else {
        // 이미 갱신 중인 경우, 갱신이 완료될 때까지 대기
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

// apiClient alias for backward compatibility
export const apiClient = axiosInstance;
