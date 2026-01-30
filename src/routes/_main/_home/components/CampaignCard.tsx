import type { CampaignItem } from "../types";
import HeartButton from "./HeartButton";
import BadgePill from "./BadgePill";

const PRIMARY = "#5B5DEB";

type Props = {
  item: CampaignItem;
  variant: "top" | "popular";
  showStartAt?: boolean;
  rightTextMode?: "progress" | "matchRate";
  onClick?: () => void;
};

export default function CampaignCard({
  item,
  variant,
  showStartAt,
  rightTextMode,
  onClick,
}: Props) {
  const showStart = showStartAt ?? variant === "top";

  const mode =
    rightTextMode ?? (variant === "popular" ? "progress" : "matchRate");

  const rightText =
    mode === "progress"
      ? item.progressText
        ? `${item.progressText}명`
        : ""
      : item.matchRate != null
        ? `${item.matchRate}%`
        : "";

  const clickableProps = onClick
    ? {
        role: "button" as const,
        tabIndex: 0,
        onClick,
        onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Enter" || e.key === " ") onClick();
        },
      }
    : {};

  return (
    <div className="w-[118px] shrink-0 text-left" {...clickableProps}>
      <div className="relative aspect-square rounded-2xl border border-black/5 bg-white shadow-[0_8px_22px_rgba(0,0,0,0.06)]">
        <div className="absolute left-2.5 right-2.5 top-2.5 flex items-center justify-between">
          <div className="flex max-w-[76px] items-center gap-1 overflow-hidden">
            {showStart && item.startAt ? (
              <BadgePill text={item.startAt} />
            ) : null}
            {item.ddayLabel ? <BadgePill text={item.ddayLabel} /> : null}
          </div>

          <HeartButton
            defaultPressed={!!item.isLiked}
            onChange={(v) => console.log("toggle like campaign", item.id, v)}
          />
        </div>

        <div className="flex h-full items-center justify-center px-3">
          {item.logoUrl ? (
            <img
              src={item.logoUrl}
              alt={item.brandName}
              className="max-h-[28px] w-auto object-contain"
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
          <div className="text-[12px] font-semibold text-black/80">
            {item.brandName}
          </div>
          <div className="text-[12px] font-semibold" style={{ color: PRIMARY }}>
            {rightText}
          </div>
        </div>

        <div className="mt-0.5 text-[10px] text-black/30">
          {item.descText ?? ""}
        </div>

        {item.rewardText ? (
          <div
            className="mt-0.5 text-[10px] font-medium"
            style={{ color: PRIMARY }}
          >
            {item.rewardText}
          </div>
        ) : null}
      </div>
    </div>
  );
}
