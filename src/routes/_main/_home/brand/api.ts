import type { BrandDomain, BrandDetailData } from "./types";
import { BRAND_DETAIL_MOCK } from "./mock"; // 너 프로젝트에 맞는 mock import로 조정

export async function fetchBrandDetail(params: {
  brandId: string;
  domain?: BrandDomain;
}): Promise<BrandDetailData> {
  const { brandId } = params;

  const data = BRAND_DETAIL_MOCK[brandId];
  if (!data) {
    // ✅ 여기서 바로 잡히면 home에서 넘어오는 id가 잘못된 것
    throw new Error(`Unknown brandId: ${brandId}`);
  }

  return data;
}
