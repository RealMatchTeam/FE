import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MatchResponseDto } from "../routes/matching/api/matching";

export type MatchingResultSummary = {
  userName: string;
  traits: {
    beauty: string;
    style: string;
    content: string;
  };
  recommendedBrand: string;
};

export type MatchingResultData = {
  completed: true;
  updatedAt: number;
  summary: MatchingResultSummary;
  // API 응답 데이터
  apiResult?: MatchResponseDto;
};

type State = {
  result: MatchingResultData | null;
  setResult: (r: MatchingResultData) => void;
  setApiResult: (apiResult: MatchResponseDto) => void;
  resetResult: () => void;
};

export const useMatchResultStore = create<State>()(
  persist(
    (set) => ({
      result: null,
      setResult: (r) => set({ result: r }),
      setApiResult: (apiResult) => {
        const topBrand = apiResult.highMatchingBrandList.brands[0];
        set({
          result: {
            completed: true,
            updatedAt: Date.now(),
            summary: {
              userName: apiResult.userType,
              traits: {
                beauty: apiResult.typeTag[0] || "",
                style: apiResult.typeTag[1] || "",
                content: apiResult.typeTag[2] || "",
              },
              recommendedBrand: topBrand?.brandName || "",
            },
            apiResult,
          },
        });
      },
      resetResult: () => set({ result: null }),
    }),
    { name: "realmatch.matchingResult" },
  ),
);
