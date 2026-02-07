import Section from "./CommonSection";
import MainIcon from "../../../../assets/MainIcon.svg";

interface MatchingSectionProps {
  onOpenReMatch: () => void;
  nickname?: string | null;
  creatorType?: string | null;
  fitBrand?: string | null;
}

export default function MatchingSection({
  onOpenReMatch,
  nickname,
  creatorType,
  fitBrand,
}: MatchingSectionProps) {
  const displayName = nickname || "크리에이터";
  const displayCreatorType = creatorType || "OO한 크리에이터";
  const displayBrand = fitBrand || "OO한 브랜드";
  return (
    <Section title="매칭검사 결과">
      <button
        type="button"
        onClick={onOpenReMatch}
        className="w-full items-center justify-between text-center rounded-[12px] bg-gradient-to-b from-[#F6F6FF] via-[#F3F3FA] to-[#E8E8FB] px-7 py-4 flex active:opacity-95"
      >
        <div>
          <div className="text-[14px] font-Medium text-[#171718] leading-[20px]">
            {displayName} 님은
          </div>
          <span className="text-[16px] leading-[20px] bg-gradient-to-r from-[#382FE4] via-[#5D5DFF] to-[#3915DA] bg-clip-text text-transparent font-SemiBold">
            {displayCreatorType}
          </span>
          <span className="text-[14px]  text-[#171718] font-Medium">
            {" "}
            입니다.
          </span>
          <br />
          <span className="text-[16px] leading-[20px] bg-gradient-to-r from-[#382FE4] via-[#5D5DFF] to-[#3915DA] bg-clip-text text-transparent font-SemiBold">
            {displayBrand}와
          </span>
          <span className="text-[14px]  text-[#171718] font-Medium">
            {" "}
            잘 어울려요.
          </span>
        </div>

        <div className="w-[80px] h-[80px] grid place-items-center">
          {/* 우측 아이콘 */}
          <img
            src={MainIcon}
            alt="Main icon"
            className="h-[80px] w-[80px] select-none"
            draggable={false}
          />
        </div>
      </button>
    </Section>
  );
}
