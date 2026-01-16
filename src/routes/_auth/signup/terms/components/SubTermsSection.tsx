import { SubTermsItem } from "./SubTermsItem";

interface SubTermsSectionProps {
  privacyUsage: boolean;
  emailPush: boolean;
  onPrivacyUsageChange: () => void;
  onEmailPushChange: () => void;
}

export function SubTermsSection({
  privacyUsage,
  emailPush,
  onPrivacyUsageChange,
  onEmailPushChange,
}: SubTermsSectionProps) {
  return (
    <div className="space-y-3">
      <SubTermsItem
        checked={privacyUsage}
        onChange={onPrivacyUsageChange}
        label="개인정보 이용 동의"
      />
      <SubTermsItem
        checked={emailPush}
        onChange={onEmailPushChange}
        label="이메일/앱 푸시 수신 동의"
      />
    </div>
  );
}
