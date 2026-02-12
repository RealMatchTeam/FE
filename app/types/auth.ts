// 공통 응답 타입
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 성별
export type Gender = "MALE" | "FEMALE" | "NONE";

// 역할
export type Role = "ADMIN" | "GUEST" | "BRAND" | "CREATOR" | "WITHDRAWN";

// 약관 타입
export type TermType =
  | "AGE"
  | "SERVICE_TERMS"
  | "PRIVACY_COLLECTION"
  | "PRIVACY_THIRD_PARTY"
  | "MARKETING_PRIVACY_COLLECTION"
  | "MARKETING_NOTIFICATION";

// 약관 동의 DTO
export interface TermAgreementDto {
  type: TermType;
  agreed: boolean;
}

// 회원가입 완료 요청
export interface SignupCompleteRequest {
  nickname: string;
  birth: string; // YYYY-MM-DD 형식
  gender: Gender;
  role: Role;
  terms: TermAgreementDto[];
  signupPurposeIds: number[];
  contentCategoryIds: number[];
}

// OAuth 토큰 응답
export interface OAuthTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// 회원가입 완료 응답
export type SignupCompleteResponse = ApiResponse<OAuthTokenResponse>;

// 닉네임 중복 확인 응답
export interface NicknameAvailableResult {
  available: boolean;
}

export type NicknameAvailableResponse = ApiResponse<NicknameAvailableResult>;
