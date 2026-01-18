// 정렬, 필터 옵션 (최신순/매칭/검토중/거절)
export type SortOption = "latest" | "matching" | "reviewing" | "rejected";

export const SORT_LABEL: Record<SortOption, string> = {
  latest: "최신순",
  matching: "매칭",
  reviewing: "검토중",
  rejected: "거절",
};