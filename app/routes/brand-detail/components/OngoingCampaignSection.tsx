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
    <section className="pt-9 pb-9">
      <div className="flex items-center justify-between">
        <div className="text-title1 text-text-black">진행 중인 다른 캠페인</div>

        {!isEmpty && onMore ? (
          <button
            type="button"
            onClick={onMore}
            className="mt-0.5 grid h-6 w-6 place-items-center"
            aria-label="more"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="#9B9BA1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}
      </div>

      {isEmpty ? (
        <div className="flex h-31.5 w-full flex-col justify-center items-start">
          <div className="flex w-full flex-col items-start gap-3.5 pt-15 pb-15">
            <div className="flex w-full flex-col items-center justify-center gap-2.5">
              <div className="w-40 text-center text-callout1 text-text-gray2">
                진행 중인 다른 캠페인이 없어요
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 -mx-4 overflow-x-auto px-5 scrollbar-hide">
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
