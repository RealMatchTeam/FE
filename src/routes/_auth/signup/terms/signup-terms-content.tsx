import { useState } from "react";
import Button from "../../../../components/common/Button";
import { CheckIcon } from "../../components/CheckIcon";
import { FlowNavigation } from "../../components/FlowNavigation";
import { TermsSection } from "./components/TermsSection";
import { SubTermsSection } from "./components/SubTermsSection";

function SignUpTermsContent() {
  const [allAgree, setAllAgree] = useState(false);
  const [age14, setAge14] = useState(false);
  const [serviceTerms, setServiceTerms] = useState(false);
  const [privacyCollection, setPrivacyCollection] = useState(false);
  const [privacy3rdParty, setPrivacy3rdParty] = useState(false);
  const [eventMarketing, setEventMarketing] = useState(false);
  const [privacyUsage, setPrivacyUsage] = useState(false);
  const [emailPush, setEmailPush] = useState(false);

  // 필수 항목이 모두 체크되었는지 확인
  const requiredChecked = age14 && serviceTerms && privacyCollection && privacy3rdParty;

  // 전체 동의 토글
  const handleAllAgree = (checked: boolean) => {
    setAllAgree(checked);
    setAge14(checked);
    setServiceTerms(checked);
    setPrivacyCollection(checked);
    setPrivacy3rdParty(checked);
    setEventMarketing(checked);
    setPrivacyUsage(checked);
    setEmailPush(checked);
  };

  // 개별 항목 변경 시 전체 동의 상태 업데이트
  const updateAllAgree = () => {
    const allChecked = age14 && serviceTerms && privacyCollection && privacy3rdParty && eventMarketing && privacyUsage && emailPush;
    setAllAgree(allChecked);
  };

  const handleNext = () => {
    if (requiredChecked) {
      // 다음 페이지로 이동
      console.log("약관 동의 완료");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-grad-auth">
      {/* 플로우 네비게이션 */}
      <FlowNavigation currentStep={1} totalSteps={4} />

      <div className="flex flex-col flex-1 px-6 py-6">

      {/* 헤더 */}
      <div className="flex-1 pt-7.5">
        <h2 className="text-title text-text-black text-center mb-15.5">
          약관에 동의해주세요
        </h2>

        {/* 약관 전체 동의 */}
        <div
          className="w-[343px] h-[52px] flex items-center gap-2 px-4 mb-6 rounded-xl bg-bg-w-80 cursor-pointer transition-colors"
          onClick={() => handleAllAgree(!allAgree)}
        >
          <CheckIcon checked={allAgree} />
          <span className="text-title1 text-text-black">약관 전체 동의</span>
        </div>

        {/* 개별 약관 */}
        <TermsSection
          age14={age14}
          serviceTerms={serviceTerms}
          privacyCollection={privacyCollection}
          privacy3rdParty={privacy3rdParty}
          eventMarketing={eventMarketing}
          onAge14Change={() => { setAge14(!age14); updateAllAgree(); }}
          onServiceTermsChange={() => { setServiceTerms(!serviceTerms); updateAllAgree(); }}
          onPrivacyCollectionChange={() => { setPrivacyCollection(!privacyCollection); updateAllAgree(); }}
          onPrivacy3rdPartyChange={() => { setPrivacy3rdParty(!privacy3rdParty); updateAllAgree(); }}
          onEventMarketingChange={() => { setEventMarketing(!eventMarketing); updateAllAgree(); }}
        />

        {/* 하위 항목들 (개인정보 이용 동의, 이메일/앱 푸시 수신 동의) */}
        <div className="mt-4 px-12">
          <SubTermsSection
            privacyUsage={privacyUsage}
            emailPush={emailPush}
            onPrivacyUsageChange={() => { setPrivacyUsage(!privacyUsage); updateAllAgree(); }}
            onEmailPushChange={() => { setEmailPush(!emailPush); updateAllAgree(); }}
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
          className={!requiredChecked ? "!bg-core-1 !text-white !cursor-not-allowed" : ""}
        >
          다음
        </Button>
      </div>
    </div>
  );
}

export default SignUpTermsContent;
