import { axiosInstance } from "../../../../api/axios";
import type { ProposalDetail, ProposalResponse } from "../../../../types/campaign";
export type { ProposalDetail, ProposalResponse };

export interface CampaignRequest {
  brandId: number;
  campaignId: number | null;
  campaignName: string;
  description: string;
  formats: { id: number }[];
  categories: { id: number; customValue?: string }[];
  tones: { id: number }[];
  involvements: { id: number }[];
  usageRanges: { id: number }[];
  rewardAmount: number;
  productId: number;
  startDate: string;
  endDate: string;
}

export const postCampaignRequest = async (data: CampaignRequest) => {
  const response = await axiosInstance.post("/api/v1/campaigns/request", data);
  return response.data;
};

// 상세 조회 API 호출 함수 이관
export const getProposalDetail = async (id: string): Promise<ProposalDetail> => {
  const response = await axiosInstance.get<ProposalResponse>(`/api/v1/campaigns/${id}`);
  return response.data.result;
};