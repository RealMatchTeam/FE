import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { tokenStorage } from "../lib/token";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Axios 인스턴스 생성
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
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
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 에러 메시지 추출
    const errorMessage = error.response?.data?.message || "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

    // 401 에러(Unauthorized) 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
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

          const response = await axios.post(
            `${BASE_URL}/api/v1/auth/refresh`,
            {},
            {
              headers: {
                RefreshToken: `Bearer ${refreshToken}`,
              },
            },
          );

          const { accessToken, refreshToken: newRefreshToken } =
            response.data.result;

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
          toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
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

    // 400 에러 및 기타 유효성 검사 에러 토스트 노출
    if (error.response) {
      toast.error(errorMessage);
    } else if (error.request) {
      toast.error("서버와 통신할 수 없습니다. 네트워크 연결을 확인해주세요.");
    }

    return Promise.reject(error);
  },
);

// apiClient alias for backward compatibility
export const apiClient = axiosInstance;
