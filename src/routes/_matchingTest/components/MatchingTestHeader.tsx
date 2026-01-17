interface MatchingTestTopBarProps {
  /** 1부터 시작 (1,2,3...) */
  step: number;
  totalSteps: number;
  onBack: () => void;

  /** 레이아웃 미세조정 필요하면 사용 */
  className?: string;
}

/*
 * 진행바 + 뒤로가기 + "n / total" 텍스트를 한 번에 통일하는 컴포넌트
 * 1/3, 2/3, 3/3에 따라 진행바 길이가 변함
 */
export default function MatchingTestHeader({
  step,
  totalSteps,
  onBack,
  className = "",
}: MatchingTestTopBarProps) {
  const safeTotal = Math.max(1, totalSteps);
  const safeStep = Math.min(Math.max(1, step), safeTotal);
  const percent = (safeStep / safeTotal) * 100;

  return (
    <div className={className}>
      {/* progress */}
      <div className="pt-2">
        <div className="h-[2px] w-full bg-bluegray-2">
          <div className="h-[2px] bg-core-1" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {/* header (step1 스타일로 통일) */}
      <div className="px-5 pt-4">
        <div className="relative flex items-center justify-center mb-6">
          <button
            type="button"
            onClick={onBack}
            className="absolute left-0 text-text-gray3 text-[24px] leading-none active:opacity-90"
            aria-label="뒤로가기"
          >
            ‹
          </button>

          <span className="text-body1 text-text-gray3">
            {safeStep} / {safeTotal}
          </span>
        </div>
      </div>
    </div>
  );
}
