


 import type { CreatorProfileModel } from "../types";

import beautyIcon from "../../../../assets/beauty-icon.svg";
import fashionIcon from "../../../../assets/fashion-icon.svg";
import contentIcon from "../../../../assets/content-icon.svg";
const PRIMARY = "#5B5DEB";

type Props = {
  model: CreatorProfileModel;
};

export default function CreatorProfileCard({ model }: Props) {
  return (
    <section className="pt-2">
      {/* 섹션 타이틀 (왼쪽 정렬) */}
      <div className="text-[14px] font-semibold text-black/85">크리에이터 님의 프로필</div>

      {/* 중앙 설명 문구 (캡쳐처럼 3줄 + 포인트 컬러 강조) */}
      <div className="mt-4 text-center text-[12px] leading-5 text-black/55">
        <div>크리에이터 님은</div>

        <div>
          <span className="font-semibold" style={{ color: PRIMARY }}>
            {model.summary}
          </span>
          입니다.
        </div>

        <div>
          <span className="font-semibold" style={{ color: PRIMARY }}>
            {model.highlightBrandText}
          </span>
                      와 잘 어울릴 것으로 보여요.
        </div>
      </div>

      {/* 아이콘 3개 (박스 없이 “그냥 일러스트”처럼) */}
      <div className="mt-5 flex items-end justify-between px-2">
        <IconBlock icon={beautyIcon} label={model.traits.beauty ?? "OO 뷰티 특성"} />
        <IconBlock icon={fashionIcon} label={model.traits.fashion ?? "OO 패션 특성"} />
        <IconBlock icon={contentIcon} label={model.traits.content ?? "OO 콘텐츠 특성"} />
      </div>

      {/* 버튼 (캡쳐처럼 그라데이션 + 그림자 + 흰 글씨, 가운데, 폭 좁게) */}
      <button
        type="button"
        className="mx-auto mt-5 block w-[160px] rounded-full bg-gradient-to-b from-[#7A7CF6] to-[#5B5DEB] py-3 text-[12px] font-semibold text-white shadow-[0_10px_20px_rgba(91,93,235,0.35)] active:opacity-95"
      >
        내 프로필 보기
      </button>
    </section>
  );
}

function IconBlock({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex w-[33.33%] flex-col items-center">
      {/* 캡쳐처럼 아이콘이 크게 “떠있는” 느낌: 배경박스 제거 + 크기 키움 */}
      <img src={icon} alt={label} className="h-[56px] w-auto object-contain" />
      <div className="mt-2 text-center text-[11px] font-medium text-black/50">{label}</div>
    </div>
  );
}
