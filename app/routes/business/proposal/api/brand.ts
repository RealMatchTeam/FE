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
    const response = await axiosInstance.get<ApiResponse<BrandSummary>>(
      `/v1/brands/${brandId}/summary`
    );
    if (response.data.isSuccess) {
      return response.data.result;
    }

    throw new Error(response.data.message || "브랜드 요약 조회 실패");
  } catch (error) {
    console.error("브랜드 요약 조회 실패:", error);
    throw error;
  }
};