import CampaignCard from "../../home/components/CampaignCard";
import { toCampaignItem } from "./toCampaignItem";
import type { BrandOngoingCampaign } from "../types";

type Props = {
  campaigns: BrandOngoingCampaign[];
  onMore?: () => void;
};

export default function OngoingCampaignSection({ campaigns, onMore }: Props) {
  return (
    <section className="pt-5 pb-5">
      <div className="flex items-center justify-between">
        <div className="text-title7 text-text-black">진행 중인 캠페인</div>

        {onMore ? (
          <button
            type="button"
            onClick={onMore}
            className="grid h-8 w-8 place-items-center rounded-full text-text-gray2"
            aria-label="more"
          >
            <span className="text-[18px] leading-none">›</span>
          </button>
        ) : (
          <div className="h-8 w-8" />
        )}
      </div>

      <div className="mt-4 -mx-5 overflow-x-auto px-5 scrollbar-hide">
        <div className="flex gap-3">
          {campaigns.map((c) => (
            <CampaignCard key={c.campaignId} item={toCampaignItem(c)} />
          ))}
        </div>
      </div>
    </section>
  );
}
