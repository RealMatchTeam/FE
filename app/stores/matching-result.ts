import { create } from "zustand";
import { persist } from "zustand/middleware";

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
};

type State = {
  result: MatchingResultData | null;
  setResult: (r: MatchingResultData) => void;
  resetResult: () => void;
};

export const useMatchResultStore = create<State>()(
  persist(
    (set) => ({
      result: null,
      setResult: (r) => set({ result: r }),
      resetResult: () => set({ result: null }),
    }),
    { name: "realmatch.matchingResult" },
  ),
);
