import type { CreatorProfileModel } from "../types";

import beautyIcon from "../../../assets/beauty-icon.svg";
import fashionIcon from "../../../assets/fashion-icon.svg";
import contentIcon from "../../../assets/content-icon.svg";

// ✅ 추가: 매칭 결과 store
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
  // ✅ 추가: store에서 userName/userType 가져오기
  const result = useMatchResultStore((s) => s.result);
  const storeName = result?.summary?.userName?.trim();
  const storeType = result?.summary?.userType?.trim();

  // ✅ store 우선, 없으면 model fallback
  const name = storeName || model.creatorName?.trim() || "크리에이터";
  const summary = storeType || model.summary?.trim() || "크리에이터";

  return (
    <section className="mt-1">
      <div className="text-[14px] font-semibold text-black">
        크리에이터 님의 프로필
      </div>

      <div className="mt-4 text-center text-[14px] leading-5 text-black/55">
        <div>
          <span className="font-semibold text-[#5B5DEB]">{name}</span> 님은
        </div>
        <div>
          <span className="font-semibold text-[#5B5DEB]">{summary}</span>입니다
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
        className="mx-auto mt-5 block w-[160px] rounded-full bg-gradient-to-b from-[#7A7CF6] to-[#5B5DEB] py-3 text-[12px] font-semibold text-white active:opacity-95 disabled:opacity-50"
        disabled={!onMyProfileClick}
      >
        내 프로필 보기
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
      <img src={icon} alt={label} className="h-[60px] w-auto object-contain" />
      <div className="mt-2 text-center text-[14px] font-medium text-black/50">
        {label}
      </div>
    </button>
  );
}
