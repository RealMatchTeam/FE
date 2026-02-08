// src/routes/campaign-detail/query.ts

import { useQuery } from "@tanstack/react-query";
import { getCampaignDetail } from "./api";

export const CAMPAIGN_DETAIL_QUERY_KEY = "campaignDetail";

export const useCampaignDetail = (campaignId?: number) => {
  return useQuery({
    queryKey: [CAMPAIGN_DETAIL_QUERY_KEY, campaignId],
    queryFn: () => getCampaignDetail(campaignId as number),
    enabled: Boolean(campaignId),
    staleTime: 1000 * 60 * 5, // 5분 캐싱
  });
};
