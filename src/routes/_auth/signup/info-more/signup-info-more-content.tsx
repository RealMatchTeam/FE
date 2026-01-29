import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm, useWatch } from "react-hook-form";
import Button from "../../../../components/common/Button";
import { FlowNavigation } from "../../components/FlowNavigation";
import { AgeSection } from "../components/AgeSection";
import { GenderSection } from "../components/GenderSection";
import { ContentCategorySection } from "../components/ContentCategorySection";

interface InfoMoreFormData {
  age: string;
  gender: string;
  contentCategories: string[];
}

function SignUpInfoMoreContent() {
  const navigate = useNavigate();
  const totalSteps = 4;

  const form = useForm<InfoMoreFormData>();
  const genderValue = useWatch({ control: form.control, name: "gender" });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleNext = () => {
    // 목적 선택 페이지로 이동 (소셜 회원가입이 아니므로 provider는 전달하지 않음)
    navigate({ to: "/signup/purpose" });
  };

  return (
    <div className="flex flex-col h-screen bg-grad-auth">
      {/* 플로우 네비게이션 */}
      <FlowNavigation currentStep={3} totalSteps={totalSteps} />

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-6">
        {/* 헤더 */}
        <h2 className="text-title text-text-black text-center mb-8">
          기본 정보를 입력해주세요
        </h2>

        <form className="space-y-6">
          {/* 나이 입력 필드 */}
          <AgeSection<InfoMoreFormData>
            setValue={form.setValue}
          />
          {/* 성별 선택 필드 */}
          <GenderSection<InfoMoreFormData>
            genderValue={genderValue}
            setValue={form.setValue}
          />
          {/* 콘텐츠 분야 선택 필드 */}
          <ContentCategorySection
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
          />
        </form>
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

export default SignUpInfoMoreContent;
