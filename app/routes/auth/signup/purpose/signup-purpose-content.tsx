import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import Button from "../../../../components/common/Button";
import { FlowNavigation } from "../../components/FlowNavigation";
import { PurposeSection } from "./components/PurposeSection";
import { useSignupStore } from "../../../../stores/signupStore";
import { signup } from "../../api/auth";

function SignUpPurposeContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const provider = searchParams.get("provider");
  const totalSteps = 3;
  const currentStep = 3;

  const { setPurposes, getSignupData, reset, signupPurposeIds: storedPurposeIds } = useSignupStore();

  // 목적 ID -> 한글 변환
  const getPurposeLabels = (ids: number[]): string[] => {
    const purposeMap: Record<number, string> = {
      1: "제품 협찬",
      2: "수익 창출",
      3: "팔로워 증대",
      4: "브랜딩 강화",
      5: "신규 브랜드 발굴",
      6: "트렌드 탐색",
    };
    return ids.map(id => purposeMap[id]).filter(Boolean);
  };

  const [selectedPurposes, setSelectedPurposes] = useState<string[]>(getPurposeLabels(storedPurposeIds));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePurpose = (purpose: string) => {
    setSelectedPurposes((prev) =>
      prev.includes(purpose)
        ? prev.filter((p) => p !== purpose)
        : [...prev, purpose]
    );
  };

  const handleNext = async () => {
    if (selectedPurposes.length === 0) {
      toast.warning("목적을 하나 이상 선택해주세요");
      return;
    }

    try {
      setIsSubmitting(true);

      // 목적 한글 → ID 매핑
      const purposeMap: Record<string, number> = {
        "제품 협찬": 1,
        "수익 창출": 2,
        "팔로워 증대": 3,
        "브랜딩 강화": 4,
        "신규 브랜드 발굴": 5,
        "트렌드 탐색": 6,
      };

      // 선택한 목적을 ID로 변환
      const purposeIds = selectedPurposes
        .map((p) => purposeMap[p])
        .filter((id) => id !== undefined);

      if (purposeIds.length === 0) {
        toast.warning("유효한 목적을 선택해주세요.");
        return;
      }

      setPurposes(purposeIds);

      // 회원가입 데이터 가져오기
      const signupData = getSignupData();

      if (!signupData) {
        toast.error("회원가입 정보가 누락되었습니다. 처음부터 다시 진행해주세요.");
        navigate(`/auth/signup/terms?provider=${provider || "kakao"}`);
        return;
      }

      // 회원가입 API 호출
      const response = await signup(signupData);

      if (response.isSuccess) {
        // 회원가입 성공
        reset();
        if (provider) {
          navigate(`/auth/signup/success?provider=${provider}`);
        } else {
          navigate("/auth/signup/success");
        }
      } else {
        // 회원가입 실패
        toast.error(response.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-grad-auth">
      {/* 플로우 네비게이션 */}
      <FlowNavigation currentStep={currentStep} totalSteps={totalSteps} />

      <div className="flex flex-col flex-1 px-6 py-6">
        {/* 헤더 */}
        <div className="flex-1">
          <h2 className="text-title text-text-black text-center mb-2">
            어떤 목적으로 사용하시나요?
          </h2>
          <p className="text-callout1 text-text-gray3 text-center mb-23.5">
            <span className="text-core-1">모두</span> 선택해주세요
          </p>

          {/* 목적 카드 섹션 */}
          <PurposeSection
            selectedPurposes={selectedPurposes}
            onTogglePurpose={togglePurpose}
          />
          <div className="mb-[107.5px] sm:mb-[90px] md:mb-[70px] lg:mb-[50px]" />
        </div>

        {/* 하단 버튼 */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleNext}
          className={isSubmitting || selectedPurposes.length === 0 ? "opacity-50" : ""}
        >
          {isSubmitting ? "가입 중" : "완료"}
        </Button>
      </div>
    </div>
  );
}

export default SignUpPurposeContent;
