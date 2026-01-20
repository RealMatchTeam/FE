import { useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useForm, useWatch } from "react-hook-form";
import Button from "../../../../components/common/Button";
import { FlowNavigation } from "../../components/FlowNavigation";
import { NameSection } from "../components/NameSection";
import { EmailSection } from "../components/EmailSection";
import { PasswordSection } from "../components/PasswordSection";
import { AgeSection } from "../components/AgeSection";
import { GenderSection } from "../components/GenderSection";
import { ContentCategorySection } from "../components/ContentCategorySection";

interface EmailFormData {
  name: string;
  nickname: string;
  email: string;
  verificationCode: string;
  password: string;
  passwordConfirm: string;
}

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
  const { type } = useSearch({ from: "/auth/signup/info" });
  const isEmail = type === "email";
  const totalSteps = isEmail ? 4 : 3;

  // Email form
  const emailForm = useForm<EmailFormData>();
  
  // 에러/성공 상태
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [nicknameSuccess, setNicknameSuccess] = useState<string | null>(null);
  const [verificationCodeError, setVerificationCodeError] = useState<string | null>(null);
  
  // 입력값 상태 확인
  const nicknameValue = useWatch({ control: emailForm.control, name: "nickname" });
  const emailValue = useWatch({ control: emailForm.control, name: "email" });

  // Social form
  const socialForm = useForm<SocialFormData>();
  const socialNicknameValue = useWatch({ control: socialForm.control, name: "nickname" });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [socialNicknameError, setSocialNicknameError] = useState<string | null>(null);
  const [socialNicknameSuccess, setSocialNicknameSuccess] = useState<string | null>(null);
  const socialGenderValue = useWatch({ control: socialForm.control, name: "gender" });

  const handleNicknameCheck = (isSocial = false) => {
    // TODO: 닉네임 중복 확인 API 호출
    const isDuplicate = false; // API 결과로 대체
    if (isDuplicate) {
      if (isSocial) {
        setSocialNicknameError("이미 존재하는 아이디입니다");
        setSocialNicknameSuccess(null);
      } else {
        setNicknameError("이미 존재하는 아이디입니다");
        setNicknameSuccess(null);
      }
    } else {
      if (isSocial) {
        setSocialNicknameError(null);
        setSocialNicknameSuccess("사용 가능한 닉네임입니다");
      } else {
        setNicknameError(null);
        setNicknameSuccess("사용 가능한 닉네임입니다");
      }
    }
  };

  const handleEmailVerify = () => {
    // TODO: 이메일 인증 API 호출
    const verificationCode = emailForm.getValues("verificationCode");
    const isValidCode = true; // API 결과로 대체
    
    if (verificationCode && !isValidCode) {
      setVerificationCodeError("인증번호가 올바르지 않습니다");
    } else {
      setVerificationCodeError(null);
      alert("인증 코드가 발송되었습니다!");
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
    if (isEmail) {
      // 이메일 회원가입: 3/4 상세 정보 페이지로 이동
      navigate({ to: "/auth/signup/info-more", search: { type: "email" } });
    } else {
      // 소셜 회원가입: 3/3 목적 선택 페이지로 이동
      navigate({ to: "/auth/signup/purpose", search: { type: "social" } });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-grad-auth">
      {/* 플로우 네비게이션 */}
      <FlowNavigation currentStep={2} totalSteps={totalSteps} />

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-6">
        <h2 className="text-title text-text-black text-center mb-8">
          기본 정보를 입력해주세요
        </h2>

        {/* 이메일 회원가입 폼 */}
        {isEmail ? (
          <form className="space-y-6">
            {/* 이름 입력 필드 */}
            <NameSection<EmailFormData>
              register={emailForm.register}
              errors={emailForm.formState.errors}
              nicknameValue={nicknameValue}
              nicknameError={nicknameError}
              nicknameSuccess={nicknameSuccess}
              onNicknameCheck={() => handleNicknameCheck(false)}
            />
            {/* 이메일 입력 필드 */}
            <EmailSection<EmailFormData>
              register={emailForm.register}
              errors={emailForm.formState.errors}
              emailValue={emailValue}
              verificationCodeError={verificationCodeError}
              onEmailVerify={handleEmailVerify}
            />
            {/* 비밀번호 입력 필드 */}
            <PasswordSection<EmailFormData>
              register={emailForm.register}
              errors={emailForm.formState.errors}
              getValues={emailForm.getValues}
            />
          </form>
        ) : (
          <>
          {/* 소셜 회원가입 폼 */}
          <form className="space-y-6">
            <NameSection<SocialFormData>
              register={socialForm.register}
              errors={socialForm.formState.errors}
              nicknameValue={socialNicknameValue}
              nicknameError={socialNicknameError}
              nicknameSuccess={socialNicknameSuccess}
              onNicknameCheck={() => handleNicknameCheck(true)}
            />
            {/* 이메일 입력 필드 */}
            <EmailSection<SocialFormData>
              register={socialForm.register}
              errors={socialForm.formState.errors}
              emailValue=""
              verificationCodeError={null}
              onEmailVerify={() => {}}
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
          </>
        )}
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
