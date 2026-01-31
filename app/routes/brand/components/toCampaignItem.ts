import type { CampaignItem } from "../../types";

export type BrandOngoingCampaign = {
  id: string;
  brandName: string;
  startAt: string;
  ddayLabel: string;
  matchRate: number;
  descText: string;
  rewardText: string;
  isLiked: boolean;
};

export function toCampaignItem(src: BrandOngoingCampaign): CampaignItem {
  return {
    id: src.id,
    brandName: src.brandName,
    startAt: src.startAt,
    ddayLabel: src.ddayLabel,
    matchRate: src.matchRate,
    descText: src.descText,
    rewardText: src.rewardText,
    isLiked: src.isLiked,
  };
}
