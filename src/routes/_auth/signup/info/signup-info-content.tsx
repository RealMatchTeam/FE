import { useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useForm, useWatch } from "react-hook-form";
import Button from "../../../../components/common/Button";
import { FlowNavigation } from "../../components/FlowNavigation";
import { NameSection } from "../components/NameSection";
import { EmailSection } from "../components/EmailSection";
import { AgeSection } from "../components/AgeSection";
import { GenderSection } from "../components/GenderSection";
import { ContentCategorySection } from "../components/ContentCategorySection";

interface SocialFormData {
  name: string;
  nickname: string;
  email: string;
  age: string;
  gender: string;
  contentCategories: string[];
}

function SignUpInfoContent() {
  const navigate = useNavigate();
  const { provider } = useSearch({ from: "/_auth/signup/info" });
  const totalSteps = 3;

  // 에러/성공 상태
  const [socialNicknameError, setSocialNicknameError] = useState<string | null>(null);
  const [socialNicknameSuccess, setSocialNicknameSuccess] = useState<string | null>(null);

  // Social form
  const socialForm = useForm<SocialFormData>();
  const socialNicknameValue = useWatch({ control: socialForm.control, name: "nickname" });
  const socialGenderValue = useWatch({ control: socialForm.control, name: "gender" });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleNicknameCheck = () => {
    // TODO: 닉네임 중복 확인 API 호출
    const isDuplicate = false; // API 결과로 대체
    if (isDuplicate) {
      setSocialNicknameError("이미 존재하는 아이디입니다");
      setSocialNicknameSuccess(null);
    } else {
      setSocialNicknameError(null);
      setSocialNicknameSuccess("사용 가능한 닉네임입니다");
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleNext = () => {
    // 소셜 회원가입: 3/3 목적 선택 페이지로 이동
    navigate({ to: "/signup/purpose", search: { provider } });
  };

  return (
    <div className="flex flex-col h-screen bg-grad-auth">
      {/* 플로우 네비게이션 */}
      <FlowNavigation currentStep={2} totalSteps={totalSteps} />

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-6">
        <h2 className="text-title text-text-black text-center mb-17.5">
          기본 정보를 입력해주세요
        </h2>

        {/* 소셜 회원가입 폼 */}
        <form className="space-y-6">
          <NameSection<SocialFormData>
            register={socialForm.register}
            errors={socialForm.formState.errors}
            nicknameValue={socialNicknameValue}
            nicknameError={socialNicknameError}
            nicknameSuccess={socialNicknameSuccess}
            onNicknameCheck={handleNicknameCheck}
          />
          {/* 이메일 입력 필드 (읽기 전용) */}
          <EmailSection<SocialFormData>
            register={socialForm.register}
            errors={socialForm.formState.errors}
            emailValue=""
            verificationCodeError={null}
            onEmailVerify={() => { }}
            readOnly
          />
          {/* 나이 입력 필드 */}
          <AgeSection<SocialFormData>
            setValue={socialForm.setValue}
          />
          {/* 성별 선택 필드 */}
          <GenderSection<SocialFormData>
            genderValue={socialGenderValue}
            setValue={socialForm.setValue}
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

export default SignUpInfoContent;
