import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import Button from "../../../../components/common/Button";
import { FlowNavigation } from "../../components/FlowNavigation";
import { NameSection } from "../components/NameSection";
import { EmailSection } from "../components/EmailSection";
import { AgeSection } from "../components/AgeSection";
import { GenderSection } from "../components/GenderSection";
import { ContentCategorySection } from "../components/ContentCategorySection";
import { useAuthStore } from "../../../../stores/auth-store";
import { useSignupStore } from "../../../../stores/signupStore";
import { tokenStorage } from "../../../../lib/token";
import { checkNicknameAvailable } from "../../api/auth";

interface SocialFormData {
  name: string;
  nickname: string;
  email: string;
  birthDate: string;
  gender: string;
  contentCategories: string[];
}

function SignUpInfoContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const provider = searchParams.get("provider");
  const totalSteps = 3;
  const me = useAuthStore((state) => state.me);
  const { setBasicInfo, setAdditionalInfo, nickname: storedNickname, birth: storedBirth, gender: storedGender, contentCategoryIds: storedCategoryIds } = useSignupStore();

  // JWT 토큰에서 이메일 파싱
  const emailFromToken = tokenStorage.getEmail();
  const nameFromToken = tokenStorage.getName();

  // 에러/성공 상태
  const [socialNicknameError, setSocialNicknameError] = useState<string | null>(null);
  const [socialNicknameSuccess, setSocialNicknameSuccess] = useState<string | null>(null);

  // 성별 영문 -> 한글 변환
  const getGenderLabel = (gender: string | null): string => {
    if (gender === "MALE") return "남성";
    if (gender === "FEMALE") return "여성";
    return "";
  };

  // 카테고리 ID -> 한글 변환
  const getCategoryLabels = (ids: number[]): string[] => {
    return ids.map(id => {
      if (id === 1) return "패션";
      if (id === 2) return "뷰티";
      return "";
    }).filter(Boolean);
  };

  const socialForm = useForm<SocialFormData>({
    defaultValues: {
      email: emailFromToken || me?.email || "",
      name: nameFromToken || me?.name || "",
      nickname: storedNickname || "",
      birthDate: storedBirth || "",
      gender: getGenderLabel(storedGender) || "",
    }
  });
  const socialNicknameValue = useWatch({ control: socialForm.control, name: "nickname" });
  const socialGenderValue = useWatch({ control: socialForm.control, name: "gender" });
  const socialBirthDateValue = useWatch({ control: socialForm.control, name: "birthDate" });
  const [selectedCategories, setSelectedCategories] = useState<string[]>(getCategoryLabels(storedCategoryIds));

  const handleNicknameCheck = async () => {
    if (!socialNicknameValue || socialNicknameValue.trim() === "") {
      toast.warning("닉네임을 입력해주세요.");
      return;
    }

    // 닉네임 형식 및 길이 검증
    // 형식: 한글, 영문, 숫자만 허용 (특수문자 및 공백 불가)
    // 길이: 2자 이상 10자 이하
    const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,10}$/;

    if (!nicknameRegex.test(socialNicknameValue)) {
      if (socialNicknameValue.length < 2 || socialNicknameValue.length > 10) {
        setSocialNicknameError("닉네임은 2자 이상 10자 이하로 입력해주세요");
      } else {
        setSocialNicknameError("한글, 영문, 숫자만 사용 가능합니다");
      }
      setSocialNicknameSuccess(null);
      return;
    }

    try {
      const response = await checkNicknameAvailable(socialNicknameValue);

      if (response.isSuccess && response.result.available) {
        setSocialNicknameError(null);
        setSocialNicknameSuccess("사용 가능한 닉네임입니다");
      } else {
        setSocialNicknameError("이미 존재하는 닉네임입니다");
        setSocialNicknameSuccess(null);
      }
    } catch (error: unknown) {
      if (error instanceof Error && "response" in error && (error as { response?: { status?: number } }).response?.status === 400) {
        setSocialNicknameError("닉네임 형식 또는 길이가 올바르지 않습니다");
        setSocialNicknameSuccess(null);
      } else {
        toast.error("닉네임 중복 확인 중 오류가 발생했습니다.");
        console.error("Nickname check error:", error);
      }
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
    // 필수 입력값 검증
    if (!socialNicknameValue || !socialBirthDateValue || !socialGenderValue) {
      toast.warning("모든 필수 정보를 입력해주세요");
      return;
    }

    // 닉네임 중복 확인 완료 여부 검증
    if (!socialNicknameSuccess) {
      toast.warning("닉네임 중복 확인을 완료해주세요");
      return;
    }

    if (selectedCategories.length === 0) {
      toast.warning("콘텐츠 분야를 하나 이상 선택해주세요");
      return;
    }

    // 성별 한글 -> 영문 변환
    const genderMap: Record<string, "MALE" | "FEMALE" | "NONE"> = {
      "남성": "MALE",
      "여성": "FEMALE",
    };
    const genderValue = genderMap[socialGenderValue] || "NONE";

    // 기본 정보 저장
    setBasicInfo(
      socialNicknameValue,
      socialBirthDateValue,
      genderValue
    );

    // 콘텐츠 카테고리 ID 변환
    const categoryIds = selectedCategories.map(category => {
      if (category === "패션") return 1;
      if (category === "뷰티") return 2;
      return 0;
    });

    setAdditionalInfo(0, categoryIds);

    navigate(`/auth/signup/purpose?provider=${provider}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-grad-auth">
      {/* 플로우 네비게이션 */}
      <FlowNavigation currentStep={2} totalSteps={totalSteps} />

      <div className="flex flex-col flex-1 px-6 py-6">
        {/* 헤더 */}
        <div className="flex flex-col">
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
              emailValue={emailFromToken || me?.email || ""}
              verificationCodeError={null}
              onEmailVerify={() => { }}
              readOnly
            />
            {/* 나이 입력 필드 */}
            <AgeSection<SocialFormData>
              setValue={socialForm.setValue}
              initialValue={storedBirth}
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
          <div className="mb-8" />
        </div>

        {/* 하단 버튼 */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleNext}
          className={`mt-6 mb-6 md:mt-10 md:mb-0 ${!socialNicknameValue ||
            !socialBirthDateValue ||
            !socialGenderValue ||
            !socialNicknameSuccess ||
            selectedCategories.length === 0
            ? "opacity-50"
            : ""
            }`}
        >
          다음
        </Button>
      </div>
    </div>
  );
}

export default SignUpInfoContent;
