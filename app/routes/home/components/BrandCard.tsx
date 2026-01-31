import type { BrandItem } from "../types";
import HeartButton from "./HeartButton";

type Props = {
  item: BrandItem;
  onClick?: () => void;
};

export default function BrandCard({ item, onClick }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className="shrink-0 text-left"
    >
      {/* ✅ 아래 UI는 기존 BrandCard 그대로 유지 */}
      <div className="w-[118px]">
        <div className="relative aspect-square rounded-2xl border border-black/5 bg-white shadow-[0_8px_22px_rgba(0,0,0,0.06)]">
          <div className="absolute right-2.5 top-2.5">
            {/* ✅ 하트 클릭이 카드 클릭으로 전파되지 않게 HeartButton에서 stopPropagation 처리 필요 */}
            <HeartButton
              defaultPressed={!!item.isLiked}
              onChange={(v) => console.log("toggle like brand", item.id, v)}
            />
          </div>

          <div className="flex h-full items-center justify-center px-3">
            {item.logoUrl ? (
              <img
                src={item.logoUrl}
                alt={item.name}
                className="max-h-[28px] w-auto object-contain"
              />
            ) : (
              <div className="text-[16px] font-semibold tracking-tight">
                {item.name}
              </div>
            )}
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline justify-between">
            <div className="text-[12px] font-semibold text-black/80">
              {item.name}
            </div>
            <div className="text-[12px] font-semibold text-core-1">
              {item.matchRate}%
            </div>
          </div>
          <div className="mt-0.5 text-[10px] text-black/30">
            {item.subText ?? ""}
          </div>
        </div>
      </div>
    </div>
  );
}
