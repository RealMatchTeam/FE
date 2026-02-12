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
    <section className="text-text-black mt-5 mb-20">
      <div className="text-title1 font-semibold mt-18 mx-2 mb-8">
        <h1>크리에이터 님의 프로필</h1>
      </div>
      <div className="text-center text-title3 leading-5">
        <div>
          <span>{name}</span> 님은
        </div>

        <div>
          <span className="text-title6 text-(--color-core-1) mr-1">
            {summary}
          </span>
          입니다
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-0 mx-4">
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
    mx-auto mt-6 block
    w-35 h-9.5
    rounded-[26px]
bg-grad-1    
p-2.5
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
      <img src={icon} alt={label} className="h-35 w-auto object-contain" />
      <div className="mt-2 text-center text-title3 text-text-gray1">
        {label}
      </div>
    </button>
  );
}
