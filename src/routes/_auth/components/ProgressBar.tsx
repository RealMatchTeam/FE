import type { ProgressBarProps } from "../types";

function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="h-1 bg-text-gray5">
      <div
        className="h-full bg-core-1 transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export default ProgressBar;
