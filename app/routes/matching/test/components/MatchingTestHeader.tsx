import goBackIcon from "../../../../assets/matchingTopbar-go-back.svg";

interface MatchingTestTopBarProps {
  step: number;
  totalSteps: number;
  onBack: () => void;
  className?: string;
}

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
      <div className="pt-2 ]">
        <div className="h-[2px] w-full bg-bluegray-2">
          <div className="h-[2px] bg-core-1" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="pt-4">
        <div className="relative mb-6 flex items-center justify-center">
          <button
            type="button"
            onClick={onBack}
            className="absolute left-[27.5px] active:opacity-90"
            aria-label="뒤로가기"
          >
            <img src={goBackIcon} alt="" className="w-[8px] h-auto" />
          </button>

          <span className="text-callout1 text-text-gray3">
            {safeStep} / {safeTotal}
          </span>
        </div>
      </div>
    </div>
  );
}
