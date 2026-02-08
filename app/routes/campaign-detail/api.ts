import { apiClient } from "../../api/axios";
import type { CampaignDetailApiResponse, CampaignDetail } from "./types";

export const getCampaignDetail = async (
  campaignId: number,
): Promise<CampaignDetail> => {
  if (!Number.isFinite(campaignId) || campaignId <= 0) {
    throw new Error("campaignId가 올바르지 않습니다.");
  }

  const res = await apiClient.get<CampaignDetailApiResponse>(
    `/api/v1/campaigns/${campaignId}`,
  );

  if (!res.data?.isSuccess) {
    throw new Error(res.data?.message || "캠페인 상세 조회 실패");
  }

  return res.data.result;
};
