import { useState } from "react";
import { useNavigate, useSearch } from "react-router";
import Button from "../../../components/common/Button";
import { CheckIcon } from "../../components/CheckIcon";
import { FlowNavigation } from "../../components/FlowNavigation";
import { TermsSection } from "./components/TermsSection";
import { SubTermsSection } from "./components/SubTermsSection";
import { TermsDetailModal } from "./components/TermsDetailModal";
import { TERMS_CONTENTS } from "../../../../data/termsData";

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
  const { provider } = useSearch({ from: "/_auth/signup/terms" });
  const totalSteps = 3;

  // 관련 상태를 하나의 객체로 그룹화
  const [terms, setTerms] = useState<TermsState>(initialTermsState);
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
    if (requiredChecked) {
      // 다음 단계로 provider 정보 전달
      navigate({ to: "/signup/info", search: { provider } });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-grad-auth">
      {/* 플로우 네비게이션 */}
      <FlowNavigation currentStep={1} totalSteps={totalSteps} />

      <div className="flex flex-col flex-1 px-6 py-6">

        {/* 헤더 */}
        <div className="flex-1">
          <h2 className="text-title text-text-black text-center mb-15">
            약관에 동의해주세요
          </h2>

          {/* 약관 전체 동의 */}
          <div
            className="w-full h-[52px] flex items-center gap-2 px-4 mb-6 rounded-xl bg-bg-w-80 cursor-pointer transition-colors"
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
          <div className="mt-4 px-12">
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
          disabled={!requiredChecked}
          onClick={handleNext}
          className={!requiredChecked ? "bg-core-1! text-white! cursor-not-allowed!" : ""}
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
