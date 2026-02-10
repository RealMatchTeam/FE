import { SubTermsItem } from "./SubTermsItem";

interface SubTermsSectionProps {
  privacyUsage: boolean;
  emailPush: boolean;
  onPrivacyUsageChange: () => void;
  onEmailPushChange: () => void;
  onDetailClick?: (key: string) => void;
}

export function SubTermsSection({
  privacyUsage,
  emailPush,
  onPrivacyUsageChange,
  onEmailPushChange,
  onDetailClick,
}: SubTermsSectionProps) {
  return (
    <div className="gap-1">
      <SubTermsItem
        checked={privacyUsage}
        onChange={onPrivacyUsageChange}
        label="개인정보 이용 동의"
        onDetailClick={() => onDetailClick?.("privacyUsage")}
      />
      <SubTermsItem
        checked={emailPush}
        onChange={onEmailPushChange}
        label="이메일/앱 푸시 수신 동의"
        onDetailClick={() => onDetailClick?.("emailPush")}
      />
    </div>
  );
}
