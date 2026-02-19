import type { CampaignItem } from "../types";
import HeartButton from "./HeartButton";
import BadgePill from "./BadgePill";

type Props = {
  item: CampaignItem;
  onClick?: () => void;
  onLikeToggle?: (id: string, newValue: boolean) => void;
};

export default function CampaignCard({ item, onClick, onLikeToggle }: Props) {
  const applicantsBadge = item.progressText ? `${item.progressText}명` : "";

  return (
    <div onClick={onClick} className="w-29.5 shrink-0 cursor-pointer text-left">
      <div className="relative aspect-square rounded-xl border border-core-2 bg-white overflow-hidden">
        <div className="absolute left-2 right-2 top-2 z-10 flex items-center justify-between">
          <div className="flex h-6 min-w-0 items-center">
            <div className="ml-1.5 flex items-center overflow-visible -translate-x-1.5 -translate-y-1.5">
              {applicantsBadge ? <BadgePill text={applicantsBadge} /> : null}

              {item.ddayLabel ? (
                <span
                  className="
                    ml-1
                    inline-flex h-4 max-w-9.5 items-center justify-center truncate
                    rounded-[5px]
                    px-1
                    text-title5 leading-3.5
                    text-core-1
                    bg-white
                    border border-core-1
                    align-middle
                  "
                  title={item.ddayLabel}
                >
                  {item.ddayLabel}
                </span>
              ) : null}
            </div>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="grid h-6 w-6 place-items-center translate-x-1.5 -translate-y-1.5"
          >
            <HeartButton
              pressed={!!item.isLiked}
              onChange={(newValue) => onLikeToggle?.(item.id, newValue)}
            />
          </div>
        </div>

        <div className="flex h-full items-center justify-center object-cover">
          {item.logoUrl ? (
            <img
              src={item.logoUrl}
              alt={item.brandName}
              draggable={false}
              className="block h-full w-full object-contain pointer-events-none select-none"
            />
          ) : (
            <div className="text-title7 tracking-tight">{item.brandName}</div>
          )}
        </div>
      </div>

      <div className="mt-2">
        <div className="flex items-baseline justify-between">
          <div className="text-title7 text-text-black">{item.brandName}</div>
          <div className="text-[14px] font-semibold text-core-1">
            {item.matchRate ? `${item.matchRate}%` : ""}
          </div>
        </div>

        <div className="ml-1 mt-0.5 text-title5 text-text-gray3">
          {item.descText ?? ""}
        </div>

        {item.rewardText ? (
          <div className="ml-1 mt-0.5 text-callout2 text-core-1">
            {item.rewardText}
          </div>
        ) : null}
      </div>
    </div>
  );
}
