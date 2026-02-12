import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import NavigationHeader from "../../../components/common/NavigateHeader";
import { useHideHeader } from "../../../hooks/useHideHeader";
import { axiosInstance } from "../../../api/axios";

type NotificationSettingResponse = {
  marketingConsent: boolean;
  appPushEnabled: boolean;
  emailEnabled: boolean;
};

type CustomResponseNotificationSettingResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: NotificationSettingResponse;
};

type CustomResponseString = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: string;
};

export default function MyPageNotifications() {
  useHideHeader(true);
  const navigate = useNavigate();
  const [benefitPush, setBenefitPush] = useState(true);
  const [appPush, setAppPush] = useState(true);
  const [emailPush, setEmailPush] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const response =
          await axiosInstance.get<CustomResponseNotificationSettingResponse>(
            "/api/v1/users/me/notification-settings",
          );

        if (!response.data.isSuccess) {
          throw new Error(response.data.message || "알림 설정 조회 실패");
        }

        const data = response.data.result;
        setBenefitPush(Boolean(data.marketingConsent));
        setAppPush(Boolean(data.appPushEnabled));
        setEmailPush(Boolean(data.emailEnabled));
      } catch (error) {
        console.error("Failed to load notification setting:", error);
      }
    };

    fetchSetting();
  }, []);

  const saveSettings = async (payload: NotificationSettingResponse) => {
    const response = await axiosInstance.put<CustomResponseString>(
      "/api/v1/users/me/notification-settings",
      payload,
    );

    if (!response.data.isSuccess) {
      throw new Error(response.data.message || "알림 설정 변경 실패");
    }

  };

  const updateSettings = async (next: NotificationSettingResponse) => {
    if (isSaving) return;
    const prev = {
      marketingConsent: benefitPush,
      appPushEnabled: appPush,
      emailEnabled: emailPush,
    };

    try {
      setIsSaving(true);
      await saveSettings(next);
    } catch (error) {
      console.error("Failed to update notification setting:", error);
      setBenefitPush(prev.marketingConsent);
      setAppPush(prev.appPushEnabled);
      setEmailPush(prev.emailEnabled);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen-full bg-[#F3F4F8]">
      <div className="w-full bg-white shadow-2xl flex flex-col">
        <div className="pt-[env(safe-area-inset-top)]">
          <div className="min-h-[60px]">
            <NavigationHeader title="알림 설정" onBack={() => navigate(-1)} />
          </div>
        </div>

        <div style={{ height: `calc(100vh - 60px - 67px - env(safe-area-inset-top))` }}>
          <div className="bg-white px-4 py-6">
            {/* 혜택 푸시 */}
            <div className="mb-6">
              <div className="text-[16px] font-semibold text-[#171718] mb-2">
                혜택 푸시
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="text-[14px] leading-[20px] font-medium text-[#171718]">
                    이벤트 혜택 및 광고성 정보 수신 동의 (선택)
                  </div>
                  <button
                    type="button"
                    className="text-[10px] leading-[12px] font-regular text-[#9B9BA1] underline mt-1"
                    onClick={() => navigate("/mypage/notification/marketing")}
                  >
                    전문보기
                  </button>
                </div>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => {
                    const next = {
                      marketingConsent: !benefitPush,
                      appPushEnabled: appPush,
                      emailEnabled: emailPush,
                    };
                    setBenefitPush(next.marketingConsent);
                    updateSettings(next);
                  }}
                  className={`relative w-[36px] h-[24px] rounded-full transition-colors ${
                    benefitPush ? "bg-[#6D6AFE]" : "bg-[#D4D4D9]"
                  }`}
                  aria-pressed={benefitPush}
                >
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] rounded-full bg-white transition-all ${
                      benefitPush ? "right-[3px]" : "left-[3px]"
                    }`}
                  />
                </button>
              </div>
              <div className="h-px w-full bg-[#E8E8FB]" />
            </div>

            {/* 알림설정 */}
            <div className="mb-6">
              <div className="text-[16px] font-semibold text-[#171718] mb-[2px]">
                알림설정
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="text-[14px] leading-[20px] font-medium text-[#171718]">앱푸시</div>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => {
                    const next = {
                      marketingConsent: benefitPush,
                      appPushEnabled: !appPush,
                      emailEnabled: emailPush,
                    };
                    setAppPush(next.appPushEnabled);
                    updateSettings(next);
                  }}
                  className={`relative w-[36px] h-[24px] rounded-full transition-colors ${
                    appPush ? "bg-[#6D6AFE]" : "bg-[#D4D4D9]"
                  }`}
                  aria-pressed={appPush}
                >
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] rounded-full bg-white transition-all ${
                      appPush ? "right-[3px]" : "left-[3px]"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="text-[14px] leading-[20px] font-medium text-[#171718] mb-[8px]">이메일</div>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => {
                    const next = {
                      marketingConsent: benefitPush,
                      appPushEnabled: appPush,
                      emailEnabled: !emailPush,
                    };
                    setEmailPush(next.emailEnabled);
                    updateSettings(next);
                  }}
                  className={`relative w-[36px] h-[24px] rounded-full transition-colors ${
                    emailPush ? "bg-[#6D6AFE]" : "bg-[#D4D4D9]"
                  }`}
                  aria-pressed={emailPush}
                >
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] rounded-full bg-white transition-all ${
                      emailPush ? "right-[3px]" : "left-[3px]"
                    }`}
                  />
                </button>
              </div>

              <div className="h-px w-full bg-[#E8E8FB]" />

              <div className="text-[12px] text-[#9B9BA1] mt-3">
                *알림을 통해 이벤트, 켐페인, 브랜드에 등에 관한 정보를 드려요
                <br />
                알림 허용을 통해 다양한 정보들을 받아 보세요
              </div>
            </div>

            <div className="h-4" />
          </div>
        </div>

      </div>
    </div>
  );
}
