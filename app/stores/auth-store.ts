import { create } from "zustand";
import { tokenStorage } from "../lib/token";

export type AuthUser = {
  id?: string;

  name?: string;
  roleText?: string;
  email?: string;
  avatarUrl?: string;
  matchingTestDone?: boolean;
};

export type AuthState = {
  me: AuthUser | null;

  // 로그인 성공 후 유저 세팅
  setMe: (user: AuthUser | null) => void;

  // 로그아웃
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  me: null,

  setMe: (user) => {
    set({ me: user });
  },

  logout: () => {
    set({ me: null });
    tokenStorage.clearTokens();
  },
}));
