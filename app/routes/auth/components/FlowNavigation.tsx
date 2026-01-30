import { useNavigate } from "react-router";

interface FlowNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
}

export function FlowNavigation({ currentStep, totalSteps, onBack }: FlowNavigationProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div>
      {/* Progress Bar */}
      <div className="relative w-full h-[3px] bg-[#E6E6F3] overflow-hidden mt-6">
        <div
          className="absolute top-0 left-0 h-full bg-core-1 transition-all duration-300 py-6"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="relative flex items-center justify-between px-6 py-6 pb-2">
        <button onClick={handleBack} className="p-2 cursor-pointer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19L8 12L15 5" stroke="#9b9ba1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 text-callout1 text-text-gray3">{currentStep} / {totalSteps}</span>
        <div className="w-10" /> {/* 균형을 위한 빈 공간 */}
      </div>
    </div>
  );
}
