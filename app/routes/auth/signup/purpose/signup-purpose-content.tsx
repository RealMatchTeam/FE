import { useState } from "react";
import { useNavigate, useSearch } from "react-router";
import Button from "../../../components/common/Button";
import { FlowNavigation } from "../../components/FlowNavigation";
import { PurposeSection } from "./components/PurposeSection";
import { useSignupStore } from "../../../../stores/signupStore";
import { signup } from "../../api/auth";

function SignUpPurposeContent() {
  const navigate = useNavigate();
  const { provider } = useSearch({ from: "/_auth/signup/purpose" });
  const totalSteps = 3;
  const currentStep = 3;

  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setPurposes, getSignupData, reset } = useSignupStore();

  const togglePurpose = (purpose: string) => {
    setSelectedPurposes((prev) =>
      prev.includes(purpose)
        ? prev.filter((p) => p !== purpose)
        : [...prev, purpose]
    );
  };

  const handleNext = async () => {
    if (selectedPurposes.length === 0) {
      alert("목적을 하나 이상 선택해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      // 선택한 목적을 store에 저장
      const purposeIds = selectedPurposes.map((p) => parseInt(p, 10));
      setPurposes(purposeIds);

      // 회원가입 데이터 가져오기
      const signupData = getSignupData();

      if (!signupData) {
        alert("회원가입 정보가 누락되었습니다. 처음부터 다시 진행해주세요.");
        navigate({ to: "/signup/terms", search: { provider: provider || "kakao" } });
        return;
      }

      // 회원가입 API 호출
      const response = await signup(signupData);

      if (response.isSuccess) {
        // 회원가입 성공
        reset();
        if (provider) {
          navigate({ to: "/signup/success", search: { provider } });
        } else {
          navigate({ to: "/signup/success" });
        }
      } else {
        // 회원가입 실패
        alert(response.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
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
          disabled={isSubmitting || selectedPurposes.length === 0}
        >
          {isSubmitting ? "가입 중..." : "완료"}
        </Button>
      </div>
    </div>
  );
}

export default SignUpPurposeContent;
