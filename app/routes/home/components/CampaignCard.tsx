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
    <div onClick={onClick} className="w-[118px] shrink-0 cursor-pointer text-left">
      <div className="relative aspect-square rounded-xl border border-core-2 bg-white">
        <div className="absolute left-2 right-2 top-2 flex items-center justify-between">
          <div className="flex h-6 min-w-0 items-center">
            <div className="ml-[6px] flex items-center overflow-visible -translate-x-[6px] -translate-y-[6px]">
              {applicantsBadge ? <BadgePill text={applicantsBadge} /> : null}

              {item.ddayLabel ? (
                <span
                  className="
                    ml-[4px]
                    inline-flex h-4 max-w-[38px] items-center justify-center truncate
                    rounded-[5px]
                    px-1
                    text-title5 font-semibold leading-[14px]
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
            className="grid h-6 w-6 place-items-center translate-x-[6px] -translate-y-[6px]"
          >
            <HeartButton
              defaultPressed={!!item.isLiked}
              onChange={(newValue) => onLikeToggle?.(item.id, newValue)}
            />
          </div>
        </div>

        <div className="flex h-full items-center justify-center px-3">
          {item.logoUrl ? (
            <img
              src={item.logoUrl}
              alt={item.brandName}
              draggable={false}
              className="block max-h-[28px] max-w-[78%] object-contain pointer-events-none select-none"
            />
          ) : (
            <div className="text-[16px] font-semibold tracking-tight">
              {item.brandName}
            </div>
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

        <div className="mt-0.5 text-title5 text-text-gray3">{item.descText ?? ""}</div>

        {item.rewardText ? (
          <div className="mt-0.5 text-title5 font-medium text-core-1">{item.rewardText}</div>
        ) : null}
      </div>
    </div>
  );
}
