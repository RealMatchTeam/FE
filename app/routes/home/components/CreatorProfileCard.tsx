// CreatorProfileCard.tsx (홈 SectionHeader/리스트 비율에 맞춘 버전)

import type { CreatorProfileModel } from "../types";

import beautyIcon from "../../../assets/beauty-icon.svg";
import fashionIcon from "../../../assets/fashion-icon.svg";
import contentIcon from "../../../assets/content-icon.svg";

const PRIMARY = "#5B5DEB";

type Props = {
  model: CreatorProfileModel;
  onMyProfileClick?: () => void;
};

export default function CreatorProfileCard({ model, onMyProfileClick }: Props) {
  const name = model.creatorName?.trim() || "크리에이터";
  const summary = model.summary?.trim() || "크리에이터";

  return (
    <section className="mt-1">
      {/* ✅ 홈 섹션 타이틀(SectionHeader title)과 동일한 크기/톤 */}
      <div className="text-[14px] font-semibold text-black">
        크리에이터 님의 프로필
      </div>

      {/* ✅ 홈 섹션 서브텍스트(SectionHeader subtitle) 리듬에 맞춤 */}
      <div className="mt-4 text-center text-[14px] leading-5 text-black/55">
        <div>
          <span className="font-semibold" style={{ color: PRIMARY }}>
            {name}
          </span>{" "}
          님은
        </div>
        <div>
          <span className="font-semibold" style={{ color: PRIMARY }}>
            {summary}
          </span>
          입니다
        </div>
      </div>

      {/* ✅ 스크린샷 비율: 아이콘은 좀 크게, 라벨은 홈 카드 보조 텍스트와 동일 */}
      <div className="mt-5 flex items-end justify-between px-1">
        <IconBlock icon={beautyIcon} label={"뷰티 특성"} />
        <IconBlock
          icon={fashionIcon}
          label={"패션 특성"}
        />
        <IconBlock
          icon={contentIcon}
          label={"콘텐츠 특성"}
        />
      </div>

      {/* ✅ 스크린샷 비율: 버튼 폭/패딩을 홈 흐름에 맞게 */}
      <button
        type="button"
        onClick={onMyProfileClick}
        className="mx-auto mt-5 block w-[160px] rounded-full bg-gradient-to-b from-[#7A7CF6] to-[#5B5DEB] py-3 text-[12px] font-semibold text-white  active:opacity-95 disabled:opacity-50"
        disabled={!onMyProfileClick}
      >
        내 프로필 보기
      </button>
    </section>
  );
}

function IconBlock({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex w-[33.33%] flex-col items-center">
      <img src={icon} alt={label} className="h-[60px] w-auto object-contain" />
      <div className="mt-2 text-center text-[14px] font-medium text-black/50">
        {label}
      </div>
    </div>
  );
}
