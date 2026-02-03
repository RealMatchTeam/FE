import type { MatchesResponseResult } from "../types/matches.types";

export type MatchingApiViewModel = {
  userType: string;
  typeTag: string[];
  brands: Array<{
    brandId: number;
    brandName: string;
    matchingRatio: number;
    logoUrl?: string;
  }>;
  count: number;
};

export function buildMatchingResult(
  api: MatchesResponseResult,
): MatchingApiViewModel {
  return {
    userType: api.userType,
    typeTag: api.typeTag,
    brands: api.highMatchingBrandList.brands,
    count: api.highMatchingBrandList.count,
  };
}
