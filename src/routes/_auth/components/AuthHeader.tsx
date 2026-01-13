import type { AuthHeaderProps } from "../types";

function AuthHeader({ currentStep, totalSteps, onBack }: AuthHeaderProps) {
  return (
    <div className="h-14 flex items-center justify-between px-4 border-b border-text-gray5">
      <button onClick={onBack} className="p-2">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="#171718"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <span className="text-body1 text-text-gray3">
        {currentStep} / {totalSteps}
      </span>
    </div>
  );
}

export default AuthHeader;
