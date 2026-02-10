import { TermsItem } from "./TermsItem";

interface TermsSectionProps {
  age14: boolean;
  serviceTerms: boolean;
  privacyCollection: boolean;
  privacy3rdParty: boolean;
  eventMarketing: boolean;
  onAge14Change: () => void;
  onServiceTermsChange: () => void;
  onPrivacyCollectionChange: () => void;
  onPrivacy3rdPartyChange: () => void;
  onEventMarketingChange: () => void;
  onDetailClick: (key: string) => void;
}

export function TermsSection({
  age14,
  serviceTerms,
  privacyCollection,
  privacy3rdParty,
  eventMarketing,
  onAge14Change,
  onServiceTermsChange,
  onPrivacyCollectionChange,
  onPrivacy3rdPartyChange,
  onEventMarketingChange,
  onDetailClick,
}: TermsSectionProps) {
  return (
    <div className="space-y-5 px-12">
      <TermsItem
        checked={age14}
        onChange={onAge14Change}
        label="만 14세 이상입니다"
        required
      />

      <TermsItem
        checked={serviceTerms}
        onChange={onServiceTermsChange}
        label="서비스 이용약관 동의"
        required
        hasArrow
        onDetailClick={() => onDetailClick("serviceTerms")}
      />

      <TermsItem
        checked={privacyCollection}
        onChange={onPrivacyCollectionChange}
        label="개인정보 수집/이용동의"
        required
        hasArrow
        onDetailClick={() => onDetailClick("privacyCollection")}
      />

      <TermsItem
        checked={privacy3rdParty}
        onChange={onPrivacy3rdPartyChange}
        label="개인정보 제3자 제공 동의"
        required
        hasArrow
        onDetailClick={() => onDetailClick("privacy3rdParty")}
      />

      <TermsItem
        checked={eventMarketing}
        onChange={onEventMarketingChange}
        label="이벤트 혜택 및 광고성 정보 수신 동의"
        hasArrow
        onDetailClick={() => onDetailClick("eventMarketing")}
        noWrap
      />
    </div>
  );
}
