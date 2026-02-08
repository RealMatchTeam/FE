import { useState } from "react";
import { useNavigate } from "react-router";
import NavigationHeader from "../../../components/common/NavigateHeader";
import { useHideHeader } from "../../../hooks/useHideHeader";

export default function MyPageNotifications() {
  useHideHeader(true);
  const navigate = useNavigate();
  const [benefitPush, setBenefitPush] = useState(true);
  const [appPush, setAppPush] = useState(true);
  const [emailPush, setEmailPush] = useState(false);

  return (
    <div className="h-screen-full bg-[#F3F4F8]">
      <div className="w-full max-w-[430px] bg-white shadow-2xl flex flex-col">
        <div className="h-[60px]">
          <NavigationHeader title="알림 설정" onBack={() => navigate(-1)} />
        </div>

        <div
          className="overflow-y-auto"
          style={{ height: "calc(100vh - 60px)" }}
        >
          <div className="bg-white px-4 py-6">
            {/* 혜택 푸시 */}
            <div className="mb-6">
              <div className="text-[16px] font-semibold text-[#171718] mb-2">
                혜택 푸시
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="text-[14px] text-[#171718]">
                    이벤트 혜택 및 광고성 정보 수신 동의 (선택)
                  </div>
                  <button
                    type="button"
                    className="text-[12px] text-[#9B9BA1] underline mt-1"
                    onClick={() => navigate("/mypage/notification/marketing")}
                  >
                    전문보기
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setBenefitPush((v) => !v)}
                  className={`relative w-[48px] h-[28px] rounded-full transition-colors ${
                    benefitPush ? "bg-[#6D6AFE]" : "bg-[#D4D4D9]"
                  }`}
                  aria-pressed={benefitPush}
                >
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full bg-white transition-all ${
                      benefitPush ? "right-[3px]" : "left-[3px]"
                    }`}
                  />
                </button>
              </div>
              <div className="h-px w-full bg-[#E8E8FB]" />
            </div>

            {/* 알림설정 */}
            <div className="mb-6">
              <div className="text-[16px] font-semibold text-[#171718] mb-2">
                알림설정
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="text-[14px] text-[#171718]">앱푸시</div>
                <button
                  type="button"
                  onClick={() => setAppPush((v) => !v)}
                  className={`relative w-[48px] h-[28px] rounded-full transition-colors ${
                    appPush ? "bg-[#6D6AFE]" : "bg-[#D4D4D9]"
                  }`}
                  aria-pressed={appPush}
                >
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full bg-white transition-all ${
                      appPush ? "right-[3px]" : "left-[3px]"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="text-[14px] text-[#171718]">이메일</div>
                <button
                  type="button"
                  onClick={() => setEmailPush((v) => !v)}
                  className={`relative w-[48px] h-[28px] rounded-full transition-colors ${
                    emailPush ? "bg-[#6D6AFE]" : "bg-[#D4D4D9]"
                  }`}
                  aria-pressed={emailPush}
                >
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full bg-white transition-all ${
                      emailPush ? "right-[3px]" : "left-[3px]"
                    }`}
                  />
                </button>
              </div>

              <div className="h-px w-full bg-[#E8E8FB]" />

              <div className="text-[12px] text-[#9B9BA1] mt-3">
                *알림을 통해 이벤트, 켐페인, 브랜드에 등에 관한 정보를 드려요
                알림 허용을 통해 다양한 정보들을 받아 보세요
              </div>
            </div>

            <div className="h-4" />
          </div>

          <div className="sticky bottom-0 bg-white px-4 pt-3 pb-[calc(1.5rem+66px+env(safe-area-inset-bottom))]">
            <button
              type="button"
              className="w-full h-[52px] rounded-[14px] bg-[#6666E5] text-white text-[15px] font-semibold"
            >
              설정 완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
