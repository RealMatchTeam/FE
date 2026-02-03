import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Gender,
  Role,
  TermAgreementDto,
  SignupCompleteRequest,
} from "../types/auth";

interface SignupState {
  // 약관 동의
  terms: TermAgreementDto[];
  // 역할
  role: Role | null;
  // 기본 정보
  nickname: string;
  birth: string; // YYYY-MM-DD
  gender: Gender | null;
  // 추가 정보
  age: number | null;
  contentCategoryIds: number[];
  // 목적
  signupPurposeIds: number[];

  // Actions
  setTerms: (terms: TermAgreementDto[]) => void;
  setRole: (role: Role) => void;
  setBasicInfo: (nickname: string, birth: string, gender: Gender) => void;
  setAdditionalInfo: (age: number, contentCategoryIds: number[]) => void;
  setPurposes: (purposeIds: number[]) => void;

  // 회원가입 데이터 가져오기
  getSignupData: () => SignupCompleteRequest | null;

  // 초기화
  reset: () => void;
}

export const useSignupStore = create<SignupState>()(
  persist(
    (set, get) => ({
      terms: [],
      role: null,
      nickname: "",
      birth: "",
      gender: null,
      age: null,
      contentCategoryIds: [],
      signupPurposeIds: [],

      setTerms: (terms) => set({ terms }),

      setRole: (role) => set({ role }),

      setBasicInfo: (nickname, birth, gender) =>
        set({ nickname, birth, gender }),

      setAdditionalInfo: (age, contentCategoryIds) =>
        set({ age, contentCategoryIds }),

      setPurposes: (purposeIds) => set({ signupPurposeIds: purposeIds }),

      getSignupData: () => {
        const state = get();

        // 필수 데이터 검증
        if (
          !state.role ||
          !state.nickname ||
          !state.birth ||
          !state.gender ||
          state.terms.length === 0
        ) {
          return null;
        }

        return {
          nickname: state.nickname,
          birth: state.birth,
          gender: state.gender,
          role: state.role,
          terms: state.terms,
          signupPurposeIds: state.signupPurposeIds,
          contentCategoryIds: state.contentCategoryIds,
        };
      },

      reset: () =>
        set({
          terms: [],
          role: null,
          nickname: "",
          birth: "",
          gender: null,
          age: null,
          contentCategoryIds: [],
          signupPurposeIds: [],
        }),
    }),
    {
      name: "signup-storage",
    }
  )
);
