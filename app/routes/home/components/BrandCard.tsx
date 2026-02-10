import type { BrandItem } from "../types";
import HeartButton from "./HeartButton";
import BadgePill from "./BadgePill";

type Props = {
  item: BrandItem;
  onClick?: () => void;
  onLikeToggle?: (id: string, newValue: boolean) => void;
};

export default function BrandCard({ item, onClick, onLikeToggle }: Props) {
  return (
    <div onClick={onClick} className="w-[118px] shrink-0 cursor-pointer text-left">
      <div className="relative aspect-square rounded-xl border border-core-2 bg-white">
        <div className="absolute left-2 right-2 top-2 flex items-center justify-between">
          <div className="flex h-6 min-w-0 items-center">
            <div className="ml-[6px] flex items-center overflow-visible -translate-x-[6px] -translate-y-[6px]">
              {item.badgeText ? <BadgePill text={item.badgeText} /> : null}
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
              alt={item.name}
              draggable={false}
              className="block max-h-[28px] max-w-[78%] object-contain pointer-events-none select-none"
            />
          ) : (
            <div className="text-[16px] font-semibold tracking-tight">{item.name}</div>
          )}
        </div>
      </div>

      <div className="mt-2">
        <div className="flex items-baseline justify-between">
          <div className="text-title7 text-text-black">{item.name}</div>
          <div className="text-[14px] font-semibold text-core-1">{item.matchRate}%</div>
        </div>

        <div className="mt-0.5 text-title5 text-text-gray3">{item.subText ?? ""}</div>
      </div>
    </div>
  );
}
