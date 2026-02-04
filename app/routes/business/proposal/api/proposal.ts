import { axiosInstance } from "../../../../api/axios";
import type { BrandDetail } from "../../../../data/brand";

// 1. 응답 데이터의 공통 포맷 정의 (isSuccess 등을 포함)
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface ProposalDetail {
  proposalId: number;
  brandId: number;
  creatorId: number;
  title: string;
  description: string;
  rewardAmount: number;
  productId: number;
  startDate: string | null;
  endDate: string | null;
  status: string;
  refusalReason: string | null;
  contentTags: {
    formats: { id: number; name: string }[];
    categories: { id: number; name: string }[];
    tones: { id: number; name: string }[];
    involvements: { id: number; name: string }[];
    usageRanges: { id: number; name: string }[];
  };
}

export const getProposalDetail = async (proposalId: string): Promise<ProposalDetail> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ProposalDetail>>(
      `/v1/campaigns/proposal/${proposalId}`
    );

    if (response.data.isSuccess) {
      return response.data.result;
    }

    throw new Error(response.data.message || "데이터 로드 실패");
  } catch (error) {
    console.error("제안 상세 조회 실패:", error);
    throw error;
  }
};

// 브랜드 상세 정보를 가져오는 API 함수 예시
export const getBrandDetail = async (brandId: number | string): Promise<BrandDetail> => {
  try {
    const response = await axiosInstance.get<ApiResponse<BrandDetail[]>>(
      `/api/v1/brands/${brandId}`
    );

    if (response.data.isSuccess) {
      // 스웨거 응답 구조상 result가 배열이므로 첫 번째 요소를 반환
      return response.data.result[0];
    }

    throw new Error(response.data.message || "브랜드 정보 로드 실패");
  } catch (error) {
    console.error("브랜드 상세 조회 실패:", error);
    throw error;
  }
};