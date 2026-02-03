import { jwtDecode } from "jwt-decode";
import type { Role } from "../types/auth";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

// JWT 페이로드 타입 정의
export interface JwtPayload {
  sub: string; // userId
  providerId?: string;
  role: Role;
  type: string;
  exp: number;
  iat: number;
  email?: string;
  name?: string;
}

export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    tokenStorage.setAccessToken(accessToken);
    tokenStorage.setRefreshToken(refreshToken);
  },

  clearTokens: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  hasTokens: (): boolean => {
    return !!(tokenStorage.getAccessToken() && tokenStorage.getRefreshToken());
  },

  /**
   * Access Token을 디코딩하여 페이로드 반환
   */
  decodeAccessToken: (): JwtPayload | null => {
    try {
      const token = tokenStorage.getAccessToken();
      if (!token) return null;
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error("Failed to decode access token:", error);
      return null;
    }
  },

  /**
   * 현재 로그인한 사용자 ID 반환
   */
  getUserId: (): string | null => {
    const payload = tokenStorage.decodeAccessToken();
    return payload?.sub || null;
  },

  /**
   * 현재 로그인한 사용자 Role 반환
   */
  getRole: (): Role | null => {
    const payload = tokenStorage.decodeAccessToken();
    return payload?.role || null;
  },

  /**
   * 현재 로그인한 사용자 Provider 반환
   */
  getProvider: (): string | null => {
    const payload = tokenStorage.decodeAccessToken();
    return payload?.providerId || null;
  },

  /**
   * 현재 로그인한 사용자 Email 반환
   */
  getEmail: (): string | null => {
    const payload = tokenStorage.decodeAccessToken();
    return payload?.email || null;
  },

  /**
   * 현재 로그인한 사용자 Name 반환
   */
  getName: (): string | null => {
    const payload = tokenStorage.decodeAccessToken();
    return payload?.name || null;
  },

  /**
   * 토큰이 만료되었는지 확인
   */
  isTokenExpired: (): boolean => {
    const payload = tokenStorage.decodeAccessToken();
    if (!payload) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  },
};
