import { useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import Button from "../../../../components/common/Button";
import { FlowNavigation } from "../../components/FlowNavigation";
import { PurposeSection } from "./components/PurposeSection";

function SignUpPurposeContent() {
  const navigate = useNavigate();
  const { provider } = useSearch({ from: "/auth/signup/purpose" });
  const totalSteps = 3;
  const currentStep = 3;

  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);

  const togglePurpose = (purpose: string) => {
    setSelectedPurposes((prev) =>
      prev.includes(purpose)
        ? prev.filter((p) => p !== purpose)
        : [...prev, purpose]
    );
  };

  const handleNext = () => {
    if (selectedPurposes.length > 0) {
      // 회원가입 완료 페이지로 이동
      navigate({ to: "/auth/signup/success", search: { provider } });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-grad-auth">
      {/* 플로우 네비게이션 */}
      <FlowNavigation currentStep={currentStep} totalSteps={totalSteps} />

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-6">
        {/* 헤더 */}
        <h2 className="text-title text-text-black text-center mb-2">
          어떤 목적으로 사용하시나요?
        </h2>
        <p className="text-callout1 text-text-gray3 text-center mb-20">
          <span className="text-core-1">모두</span> 선택해주세요
        </p>

        {/* 목적 카드 섹션 */}
        <PurposeSection
          selectedPurposes={selectedPurposes}
          onTogglePurpose={togglePurpose}
        />
      </div>

      {/* 고정 하단 버튼 */}
      <div className="px-6 pb-6 pt-4">
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
}

export default SignUpPurposeContent;
