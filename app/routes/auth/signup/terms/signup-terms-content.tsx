import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import Button from "../../../../components/common/Button";
import { CheckIcon } from "../../components/CheckIcon";
import { FlowNavigation } from "../../components/FlowNavigation";
import { TermsSection } from "./components/TermsSection";
import { SubTermsSection } from "./components/SubTermsSection";
import { TermsDetailModal } from "./components/TermsDetailModal";
import { TERMS_CONTENTS } from "../../../../data/termsData";
import { useSignupStore } from "../../../../stores/signupStore";

// 약관 동의 상태 타입 정의
interface TermsState {
  age14: boolean;
  serviceTerms: boolean;
  privacyCollection: boolean;
  privacy3rdParty: boolean;
  eventMarketing: boolean;
  privacyUsage: boolean;
  emailPush: boolean;
}

// 초기 상태
const initialTermsState: TermsState = {
  age14: false,
  serviceTerms: false,
  privacyCollection: false,
  privacy3rdParty: false,
  eventMarketing: false,
  privacyUsage: false,
  emailPush: false,
};

function SignUpTermsContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const provider = searchParams.get("provider");
  const totalSteps = 3;
  const { setTerms: setSignupTerms, setRole, terms: storedTerms } = useSignupStore();

  // provider 검증 - kakao, naver, google만 허용
  useEffect(() => {
    if (!provider || !["kakao", "naver", "google"].includes(provider)) {
      console.error("Invalid or missing provider:", provider);
      navigate("/auth/login");
    }
  }, [provider, navigate]);

  // store에 저장된 약관 데이터를 초기값으로 변환
  const getInitialTermsState = (): TermsState => {
    if (storedTerms.length === 0) return initialTermsState;

    const termsState: TermsState = { ...initialTermsState };
    storedTerms.forEach((term) => {
      switch (term.type) {
        case "AGE":
          termsState.age14 = term.agreed;
          break;
        case "SERVICE_TERMS":
          termsState.serviceTerms = term.agreed;
          break;
        case "PRIVACY_COLLECTION":
          termsState.privacyCollection = term.agreed;
          break;
        case "PRIVACY_THIRD_PARTY":
          termsState.privacy3rdParty = term.agreed;
          break;
        case "MARKETING_PRIVACY_COLLECTION":
          termsState.eventMarketing = term.agreed;
          break;
        case "MARKETING_NOTIFICATION":
          termsState.emailPush = term.agreed;
          break;
      }
    });
    return termsState;
  };

  // 관련 상태를 하나의 객체로 그룹화
  const [terms, setTerms] = useState<TermsState>(getInitialTermsState);
  const [detailModal, setDetailModal] = useState<{ isOpen: boolean; title: string; content: string }>({
    isOpen: false,
    title: "",
    content: ""
  });

  // 전체 동의 여부는 상태에서 파생
  const allAgree = Object.values(terms).every(Boolean);

  // 필수 항목이 모두 체크되었는지 확인 
  const requiredChecked =
    terms.age14 && terms.serviceTerms && terms.privacyCollection && terms.privacy3rdParty;

  // 전체 동의 토글
  const handleAllAgree = (checked: boolean) => {
    setTerms({
      age14: checked,
      serviceTerms: checked,
      privacyCollection: checked,
      privacy3rdParty: checked,
      eventMarketing: checked,
      privacyUsage: checked,
      emailPush: checked,
    });
  };

  // 개별 항목 토글 - 새로운 값을 기반으로 상태 업데이트
  const handleTermChange = (key: keyof TermsState) => {
    setTerms((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // 상세 보기 클릭 핸들러
  const handleDetailClick = (key: string) => {
    const content = TERMS_CONTENTS[key];
    if (content) {
      setDetailModal({
        isOpen: true,
        title: content.title,
        content: content.content
      });
    }
  };

  const handleNext = () => {
    if (!requiredChecked) {
      toast.warning("필수 약관에 동의해주세요");
      return;
    }

    // 약관 동의 정보를 signupStore에 저장
    const termsArray = [
      { type: "AGE" as const, agreed: terms.age14 },
      { type: "SERVICE_TERMS" as const, agreed: terms.serviceTerms },
      { type: "PRIVACY_COLLECTION" as const, agreed: terms.privacyCollection },
      { type: "PRIVACY_THIRD_PARTY" as const, agreed: terms.privacy3rdParty },
      { type: "MARKETING_PRIVACY_COLLECTION" as const, agreed: terms.eventMarketing },
      { type: "MARKETING_NOTIFICATION" as const, agreed: terms.emailPush },
    ];

    setSignupTerms(termsArray);

    // 소셜 로그인 사용자는 CREATOR로 설정 (추후 type 선택 페이지 추가 시 변경 가능)
    setRole("CREATOR");

    // 다음 단계로 provider 정보 전달
    navigate(`/auth/signup/info?provider=${provider}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-grad-auth">
      {/* 플로우 네비게이션 */}
      <FlowNavigation currentStep={1} totalSteps={totalSteps} />

      <div className="flex flex-col flex-1 px-6 py-6">

        {/* 헤더 */}
        <div className="flex flex-col">
          <h2 className="text-title text-text-black text-center mb-23.5">
            약관에 동의해주세요
          </h2>

          {/* 약관 전체 동의 */}
          <div
            className="w-full flex items-center gap-2 py-4 px-4 mb-9 rounded-xl bg-bg-w-80 cursor-pointer transition-colors"
            onClick={() => handleAllAgree(!allAgree)}
          >
            <CheckIcon checked={allAgree} />
            <span className="text-title1 text-text-black">약관 전체 동의</span>
          </div>

          {/* 개별 약관 */}
          <TermsSection
            age14={terms.age14}
            serviceTerms={terms.serviceTerms}
            privacyCollection={terms.privacyCollection}
            privacy3rdParty={terms.privacy3rdParty}
            eventMarketing={terms.eventMarketing}
            onAge14Change={() => handleTermChange("age14")}
            onServiceTermsChange={() => handleTermChange("serviceTerms")}
            onPrivacyCollectionChange={() => handleTermChange("privacyCollection")}
            onPrivacy3rdPartyChange={() => handleTermChange("privacy3rdParty")}
            onEventMarketingChange={() => handleTermChange("eventMarketing")}
            onDetailClick={handleDetailClick}
          />

          {/* 하위 항목들 (개인정보 이용 동의, 이메일/앱 푸시 수신 동의) */}
          <div className="mt-4 px-12 mb-8">
            <SubTermsSection
              privacyUsage={terms.privacyUsage}
              emailPush={terms.emailPush}
              onPrivacyUsageChange={() => handleTermChange("privacyUsage")}
              onEmailPushChange={() => handleTermChange("emailPush")}
              onDetailClick={handleDetailClick}
            />
          </div>
        </div>

        {/* 하단 버튼 */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleNext}
          className={`mt-auto md:mt-10 ${!requiredChecked ? "opacity-50" : ""}`}
        >
          다음
        </Button>
      </div>

      {/* 약관 상세 모달 */}
      <TermsDetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal(prev => ({ ...prev, isOpen: false }))}
        title={detailModal.title}
        content={detailModal.content}
      />
    </div>
  );
}

export default SignUpTermsContent;
