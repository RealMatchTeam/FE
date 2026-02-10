import Section from "./CommonSection";
import MainIcon from "../../../../assets/MainIcon.png";

interface MatchingSectionProps {
  onOpenReMatch: () => void;
  nickname?: string | null;
  creatorType?: string | null;
}

export default function MatchingSection({
  onOpenReMatch,
  nickname,
  creatorType,
}: MatchingSectionProps) {
  const displayName = nickname || "크리에이터";
  const displayCreatorType = creatorType || "OO한 크리에이터";
  return (
    <Section title="매칭검사 결과">
      <button
        type="button"
        onClick={onOpenReMatch}
        className="w-full h-[118px] items-center justify-between text-center rounded-[12px] bg-gradient-to-b from-[#F6F6FF] via-[#F3F3FA] to-[#E8E8FB] px-10 py-4 flex active:opacity-95"
      >
        <div className="flex h-full flex-col items-start justify-center gap-[2px] text-left">
          <div className="text-title3 text-[#171718]">{displayName} 님은</div>
          <div className="flex items-center gap-2">
            <span className="text-[16px] leading-[20px] bg-gradient-to-r from-[#382FE4] via-[#5D5DFF] to-[#3915DA] bg-clip-text text-transparent font-semibold">
              {displayCreatorType}
            </span>
            <div className="text-title3 text-[#171718]"> 입니다.</div>
          </div>
          <div className="text-callout1 text-[#B7B7F3] underline underline-offset-2 mt-[8px]">
            재검사하기
          </div>
        </div>

        <div className="w-[90px] h-[90px] grid place-items-center">
          {/* 우측 아이콘 */}
          <img
            src={MainIcon}
            alt="Main icon"
            className="h-[90px] w-[90px] select-none"
            draggable={false}
          />
        </div>
      </button>
    </Section>
  );
}
