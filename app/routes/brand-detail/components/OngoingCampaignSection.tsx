import CampaignCard from "../../home/components/CampaignCard";
import { toCampaignItem } from "./toCampaignItem";
import type { BrandOngoingCampaign } from "../types";

type Props = {
  campaigns: BrandOngoingCampaign[];
  brandLogoUrl?: string;
  onMore?: () => void;
  onCampaignClick?: (c: BrandOngoingCampaign) => void;
  onLikeToggle?: (id: string) => void;
};

export default function OngoingCampaignSection({
  campaigns,
  brandLogoUrl,
  onMore,
  onCampaignClick,
  onLikeToggle,
}: Props) {
  const isEmpty = campaigns.length === 0;

  return (
    <section className="pt-9 pb-9 px-2">
      <div className="flex items-center justify-between">
        <div className="text-title1 text-text-black">진행 중인 다른 캠페인</div>

        {!isEmpty && onMore ? (
          <button
            type="button"
            onClick={onMore}
            className="grid h-8 w-8 place-items-center rounded-full text-text-gray2"
            aria-label="more"
          >
            <span className="text-[18px] leading-none">›</span>
          </button>
        ) : null}
      </div>

      {isEmpty ? (
        <div className="flex h-[126px] w-full flex-col justify-center items-start">
          <div className="flex w-full flex-col items-start gap-[14px] pt-[50px] pb-[60px]">
            <div className="flex w-full flex-col items-center justify-center gap-[10px]">
              <div className="w-[113px] text-center text-[12px] font-medium leading-[16px] text-text-gray2">
                진행 중인 다른 캠페인이 없어요
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 -mx-5 overflow-x-auto px-5 scrollbar-hide">
          <div className="flex gap-3">
            {campaigns.map((c) => (
              <div
                key={c.campaignId}
                role="button"
                tabIndex={0}
                onClick={() => onCampaignClick?.(c)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onCampaignClick?.(c);
                  }
                }}
                className="text-left"
              >
                <CampaignCard
                  item={toCampaignItem(c, brandLogoUrl)}
                  onClick={() => onCampaignClick?.(c)}
                  onLikeToggle={onLikeToggle}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
