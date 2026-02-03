// src/routes/_home/components/BrandCard.tsx
import type { BrandItem } from "../types";
import HeartButton from "./HeartButton";
import BadgePill from "./BadgePill";

const PRIMARY = "#5B5DEB";

type Props = {
  item: BrandItem;
  onClick?: () => void;
  onLikeToggle?: (id: string, newValue: boolean) => void;
};

export default function BrandCard({ item, onClick, onLikeToggle }: Props) {
  return (
    <div
      onClick={onClick}
      className="w-[118px] shrink-0 cursor-pointer text-left"
    >
      <div className="relative aspect-square rounded-2xl border border-black/5 bg-white shadow-[0_8px_22px_rgba(0,0,0,0.06)]">
        {/* 상단: 좌 배지 / 우 하트 */}
        <div className="absolute left-2.5 right-2.5 top-2.5 flex items-center justify-between">
          <div className="flex max-w-[76px] items-center gap-1 overflow-hidden">
            {/* Brand 배지도 Campaign 배지와 동일 컴포넌트 */}
            {item.badgeText ? <BadgePill text={item.badgeText} /> : null}
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <HeartButton
              defaultPressed={!!item.isLiked}
              onChange={(newValue) => onLikeToggle?.(item.id, newValue)}
            />
          </div>
        </div>

        {/* 중앙 로고 */}
        <div className="flex h-full items-center justify-center px-3">
          {item.logoUrl ? (
            <img
              src={item.logoUrl}
              alt={item.name}
              className="max-h-[28px] w-auto object-contain"
            />
          ) : (
            <div className="text-[18px] font-semibold tracking-tight">
              {item.name}
            </div>
          )}
        </div>
      </div>

      {/* 카드 아래 텍스트 */}
      <div className="mt-2">
        <div className="flex items-baseline justify-between">
          <div className="text-[12px] font-semibold text-black/80">
            {item.name}
          </div>
          <div className="text-[12px] font-semibold" style={{ color: PRIMARY }}>
            {item.matchRate}%
          </div>
        </div>
        <div className="mt-0.5 text-[10px] text-black/30">
          {item.subText ?? ""}
        </div>
      </div>
    </div>
  );
}
