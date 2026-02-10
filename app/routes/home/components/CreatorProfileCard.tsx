import type { CreatorProfileModel } from "../types";

import beautyIcon from "../../../assets/beauty-icon.svg";
import fashionIcon from "../../../assets/fashion-icon.svg";
import contentIcon from "../../../assets/content-icon.svg";
import { useMatchResultStore } from "../../../stores/matching-result";

type TraitType = "beauty" | "fashion" | "content";

type Props = {
  model: CreatorProfileModel;
  onMyProfileClick?: () => void;
  onTraitClick?: (type: TraitType) => void;
};

export default function CreatorProfileCard({
  model,
  onMyProfileClick,
  onTraitClick,
}: Props) {
  const result = useMatchResultStore((s) => s.result);
  const storeName = result?.summary?.userName?.trim();
  const storeType = result?.summary?.userType?.trim();

  const name = storeName || model.creatorName?.trim() || "크리에이터";
  const summary = storeType || model.summary?.trim() || "크리에이터";

  return (
    <section className=" text-[var(--color-text-black)]">
      <div className="text-title1 font-semibold">
        크리에이터 님의 프로필
      </div>
<div className="mt-4 text-center text-title3 leading-5">
  <div>
    <span>{name}</span> 님은
  </div>

  <div className="font-medium">
    <span className="text-title6 text-[var(--color-core-1)] mr-1">
      {summary}
    </span>
    입니다
  </div>
</div>


      <div className="mt-5 flex items-end justify-between px-1">
        <IconBlock
          icon={beautyIcon}
          label="뷰티 특성"
          onClick={onTraitClick ? () => onTraitClick("beauty") : undefined}
        />
        <IconBlock
          icon={fashionIcon}
          label="패션 특성"
          onClick={onTraitClick ? () => onTraitClick("fashion") : undefined}
        />
        <IconBlock
          icon={contentIcon}
          label="콘텐츠 특성"
          onClick={onTraitClick ? () => onTraitClick("content") : undefined}
        />
      </div>

<button
  type="button"
  onClick={onMyProfileClick}
  disabled={!onMyProfileClick}
  className="
    mx-auto mt-5 block
    w-[140px] h-[38px]
    rounded-[26px]
bg-grad-1    
p-[10px]
    shadow-[0_8px_20px_rgba(182,185,255,0.35)]
    disabled:opacity-50
    transition
  "
>
  <div
    className="
      flex h-full w-full items-center justify-center
      rounded-[20px]
      text-title7 font-semibold
      text-white
    "
  >
    내 프로필 가기
  </div>
</button>

    </section>
  );
}

function IconBlock({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick?: () => void;
}) {
  const clickable = Boolean(onClick);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!clickable}
      className="flex w-[33.33%] flex-col items-center disabled:cursor-default"
    >
      <img src={icon} alt={label} className="h-[100px] w-auto object-contain" />
      <div className="mt-2 text-center text-title3 text-[var(--color-text-gray1)]">
        {label}
      </div>
    </button>
  );
}
