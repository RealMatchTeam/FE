import CampaignCard from "../../home/components/CampaignCard";
import { toCampaignItem } from "./toCampaignItem";
import type { BrandOngoingCampaign } from "../types";

type Props = {
  campaigns: BrandOngoingCampaign[];
  onMore?: () => void;
  onCampaignClick?: (c: BrandOngoingCampaign) => void;
  onLikeToggle?: (id: string) => void;
};

export default function OngoingCampaignSection({
  campaigns,
  onMore,
  onCampaignClick,
  onLikeToggle,
}: Props) {
  const isEmpty = campaigns.length === 0;

  return (
    <section className="py-9">
      <div className="flex items-center justify-between">
        <div className="text-title1 text-text-black">진행 중인 캠페인</div>

        {onMore ? (
          <button
            type="button"
            onClick={onMore}
            className="mt-0.5 grid h-6 w-6 place-items-center text-[var(--color-text-gray3)]"
            aria-label="more"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="#9B9BA1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <div className="h-6 w-6" />
        )}
      </div>

      {isEmpty ? (
        <div className="mt-2 inline-flex w-full flex-col items-start gap-2 bg-white">
          <div className="flex h-[126px] w-full flex-col items-start justify-center">
            <div className="flex w-full flex-col items-start gap-[14px] pb-[60px] pt-[60px]">
              <div className="flex w-full flex-col items-center justify-center gap-[10px]">
                <div className=" text-center text-callout1 text-text-gray2">
                  진행 중인 캠페인이 없어요
                </div>
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
                  item={toCampaignItem(c)}
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
