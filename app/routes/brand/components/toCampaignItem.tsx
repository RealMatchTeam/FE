import type { CampaignItem } from "../../../types/creator";
import type { BrandOngoingCampaign } from "../../../types/campaign";

export function toCampaignItem(campaign: BrandOngoingCampaign): CampaignItem {

  const ddayLabel = campaign.dday === 0 ? "D-DAY" : `D-${campaign.dday}`;

  const result: CampaignItem = {
    id: String(campaign.campaignId),
    brandName: campaign.brandName || "",
    logoUrl: campaign.imageUrl || undefined,
    progressText: String(campaign.recruitQuota || 0),
    ddayLabel,
    descText: campaign.title || "",
    rewardText: campaign.rewardAmount > 0 ? `원고료 ${campaign.rewardAmount.toLocaleString()}원` : "",
    isLiked: campaign.isLiked,
  };

  return result;
}
