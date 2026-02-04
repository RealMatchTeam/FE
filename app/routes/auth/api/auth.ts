import { apiClient } from "../../../api/axios";
import { tokenStorage } from "../../../lib/token";
import type {
  SignupCompleteRequest,
  SignupCompleteResponse,
} from "../../../types/auth";

/**
 * 회원가입 완료 API
 * 소셜 로그인 후, 추가 정보를 입력하여 회원가입을 완료합니다.
 */
export const signup = async (
  data: SignupCompleteRequest
): Promise<SignupCompleteResponse> => {
  const response = await apiClient.post<SignupCompleteResponse>(
    "/api/v1/auth/signup",
    data
  );

  // 회원가입 성공 시 토큰 저장
  if (response.data.isSuccess && response.data.result) {
    const { accessToken, refreshToken } = response.data.result;
    tokenStorage.setTokens(accessToken, refreshToken);
  }

  return response.data;
};

/**
 * 토큰 갱신 API
 * Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.
 */
export const refreshToken = async (): Promise<SignupCompleteResponse> => {
  const currentRefreshToken = tokenStorage.getRefreshToken();

  if (!currentRefreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await apiClient.post<SignupCompleteResponse>(
    "/api/v1/auth/refresh",
    {},
    {
      headers: {
        RefreshToken: `Bearer ${currentRefreshToken}`,
      },
    }
  );

  // 토큰 갱신 성공 시 새 토큰 저장
  if (response.data.isSuccess && response.data.result) {
    const { accessToken, refreshToken: newRefreshToken } =
      response.data.result;
    tokenStorage.setTokens(accessToken, newRefreshToken);
  }

  return response.data;
};

/**
 * 로그아웃
 * 로컬에 저장된 토큰을 제거합니다.
 */
export const logout = (): void => {
  tokenStorage.clearTokens();
};
