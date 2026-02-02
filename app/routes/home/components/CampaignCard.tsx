// src/routes/_home/components/CampaignCard.tsx
import type { CampaignItem } from "../types";
import HeartButton from "./HeartButton";
import BadgePill from "./BadgePill";

const PRIMARY = "#5B5DEB";

type Props = {
  item: CampaignItem;
  variant: "top" | "popular";
  onClick?: () => void;
  onLikeToggle?: (id: string, newValue: boolean) => void;
};

export default function CampaignCard({ item, variant, onClick, onLikeToggle }: Props) {
  const rightText = item.progressText ? `${item.progressText}명` : "";

  return (
    <div
      onClick={onClick}
      className="w-[118px] shrink-0 cursor-pointer text-left"
    >
      <div className="relative aspect-square rounded-2xl border border-black/5 bg-white shadow-[0_8px_22px_rgba(0,0,0,0.06)]">
        <div className="absolute left-2.5 right-2.5 top-2.5 flex items-center justify-between">
          <div className="flex max-w-[76px] items-center gap-1 overflow-hidden">
            {variant === "top" && item.startAt ? <BadgePill text={item.startAt} /> : null}
            {item.ddayLabel ? <BadgePill text={item.ddayLabel} /> : null}
          </div>

          <div onClick={(e) => e.stopPropagation()}>
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
              className="max-h-[28px] w-auto object-contain"
            />
          ) : (
            <div className="text-[16px] font-semibold tracking-tight">{item.brandName}</div>
          )}
        </div>
      </div>

      <div className="mt-2">
        <div className="flex items-baseline justify-between">
          <div className="text-[12px] font-semibold text-black/80">{item.brandName}</div>
          <div className="text-[12px] font-semibold" style={{ color: PRIMARY }}>
            {rightText}
          </div>
        </div>

        <div className="mt-0.5 text-[10px] text-black/30">{item.descText ?? ""}</div>

        {item.rewardText ? (
          <div className="mt-0.5 text-[10px] font-medium" style={{ color: PRIMARY }}>
            {item.rewardText}
          </div>
        ) : null}
      </div>
    </div>
  );
}
