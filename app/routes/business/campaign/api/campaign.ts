import { axiosInstance } from "../../../../api/axios";

export interface CampaignRequest {
  brandId: number;
  campaignId: number | null;
  campaignName: string;
  description: string;
  formats: { id: string }[];
  categories: { id: string; customValue?: string }[];
  tones: { id: string }[];
  involvements: { id: string }[];
  usageRanges: { id: string }[];
  rewardAmount: number;
  productId: number;
  startDate: string;
  endDate: string;
}

export const postCampaignRequest = async (data: CampaignRequest) => {
  const response = await axiosInstance.post("/api/v1/campaigns/request", data);
  return response.data;
};