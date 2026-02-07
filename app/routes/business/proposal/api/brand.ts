import { axiosInstance } from "../../../../api/axios"; // 경로 확인 필요
import type { ApiResponse } from "./proposal";

export interface BrandSummary {
  brandId: number;
  brandName: string;
  brandImageUrl: string;
  brandTags: string[];
  matchingRate: number;
}

export const getBrandSummary = async (brandId: number): Promise<BrandSummary> => {
  try {
    // proposal.ts와 동일한 axiosInstance 사용
    const response = await axiosInstance.get<ApiResponse<BrandSummary>>(
      `/v1/brands/${brandId}/summary`
    );

    // 공통 응답 구조(isSuccess) 확인
    if (response.data.isSuccess) {
      return response.data.result;
    }

    throw new Error(response.data.message || "브랜드 요약 조회 실패");
  } catch (error) {
    console.error("브랜드 요약 조회 실패:", error);
    throw error;
  }
};