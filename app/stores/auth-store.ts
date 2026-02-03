// stores/auth-store.ts
import { create } from "zustand";

export type AuthUser = {
  // optional로 둠
  id?: string;

  name?: string;
  roleText?: string; // "홍길동" 같은 라벨
  email?: string;
  avatarUrl?: string;

  // MyPageContent에서 쓰는 필드명 그대로
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
    // localStorage.removeItem("accessToken");
  },
}));
