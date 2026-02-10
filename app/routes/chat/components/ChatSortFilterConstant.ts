export const SORT_LABEL = {
  latest: "최신순",
  collaborating: "협업 중",
} as const;

export type SortOption = keyof typeof SORT_LABEL;
