import { AxiosError } from "axios";
import { axiosInstance } from "../../../../api/axios";
import type { BrandDetail } from "../../../../data/brand";

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
      `/v1/brands/${brandId}`
    );

    if (response.data.isSuccess) {
      return response.data.result[0];
    }

    throw new Error(response.data.message || "브랜드 정보 로드 실패");
  } catch (error) {
    console.error("브랜드 상세 조회 실패:", error);
    throw error;
  }
};

// 지원 상세 데이터 인터페이스
export interface AppliedCampaignDetail {
  campaignId: number;
  campaignApplyId: number;
  brandId: number;     
  brandName: string;
  campaignTitle: string;
  campaignReason: string;
  status: "REVIEWING" | "MATCHED" | "REJECTED" | "CANCELED";
  creatorId?: string;
}

export const getAppliedCampaignDetail = async (campaignId: string): Promise<AppliedCampaignDetail> => {
  try {
    const response = await axiosInstance.get<AppliedCampaignDetail>(
      `/v1/campaigns/${campaignId}/apply/me`
    );
    if (response.data && response.data.campaignId !== undefined) {
      return response.data;
    }

    throw new Error("데이터를 가져오는 데 실패했습니다.");
  } catch (error: unknown) {
    console.error("지원 상세 조회 실패:", error);

    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || "지원 상세 데이터 로드 실패";
      throw new Error(errorMessage);
    }
    
    if (error instanceof Error) throw error;
    
    throw new Error("알 수 없는 에러가 발생했습니다.");
  }
};

export const approveCampaignProposal = async (campaignProposalId: string | number): Promise<ApiResponse<string>> => {
  try {
    const response = await axiosInstance.patch<ApiResponse<string>>(
      `/v1/campaigns/proposal/${campaignProposalId}/approve`
    );
    return response.data;
  } catch (error) {
    console.error("제안 수락 실패:", error);
    throw error;
  }
};

// 받은 캠페인 제안 거절 API
export const rejectCampaignProposal = async (
  campaignProposalId: string | number,
  rejectReason: string
): Promise<ApiResponse<string>> => {
  try {
    
    const response = await axiosInstance.patch<ApiResponse<string>>(
      `/v1/campaigns/proposal/${campaignProposalId}/reject`,
      { rejectReason } 
    );
    return response.data;
  } catch (error) {
    console.error("제안 거절 실패:", error);
    throw error;
  }
};

// 보낸 캠페인 제안 취소 API
export const cancelCampaignProposal = async (
  campaignProposalId: string | number
): Promise<ApiResponse<string>> => {
  try {
    const response = await axiosInstance.patch<ApiResponse<string>>(
      `/v1/campaigns/proposal/${campaignProposalId}/cancel`
    );
    return response.data;
  } catch (error) {
    console.error("제안 취소 실패:", error);
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || "제안 취소에 실패했습니다.";
      throw new Error(errorMessage);
    }
    throw error;
  }
};

// 캠페인 지원 취소 API

export const cancelCampaignApply = async (
  campaignApplyId: string | number
): Promise<ApiResponse<string>> => {
  try {
    const response = await axiosInstance.patch<ApiResponse<string>>(
      `/v1/campaigns/apply/${campaignApplyId}/cancel`
    );
    return response.data;
  } catch (error) {
    console.error("지원 취소 실패:", error);
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || "지원 취소에 실패했습니다.";
      throw new Error(errorMessage);
    }
    throw error;
  }
};