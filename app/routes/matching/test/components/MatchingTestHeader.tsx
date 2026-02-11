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
      <div className="pt-2">
        <div className="h-[2px] w-full bg-bluegray-2">
          <div className="h-[2px] bg-core-1" style={{ width: `${percent}%` }} />
        </div>
      </div>

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
