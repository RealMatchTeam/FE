import { useState } from "react";
import type { FormProps } from "../types";
import { checkRequiredAgreements } from "../utils";
import AuthHeader from "./AuthHeader";
import ProgressBar from "./ProgressBar";

function AgreementForm({ onClose, onNext }: FormProps) {
  const [allAgree, setAllAgree] = useState(false);
  const [age14, setAge14] = useState(false);
  const [serviceTerms, setServiceTerms] = useState(false);
  const [privacyCollection, setPrivacyCollection] = useState(false);
  const [privacy3rdParty, setPrivacy3rdParty] = useState(false);
  const [eventMarketing, setEventMarketing] = useState(false);

  // 필수 항목이 모두 체크되었는지 확인
  const requiredChecked = checkRequiredAgreements({
    age14,
    serviceTerms,
    privacyCollection,
    privacy3rdParty,
  });

  // 전체 동의 토글
  const handleAllAgree = (checked: boolean) => {
    setAllAgree(checked);
    setAge14(checked);
    setServiceTerms(checked);
    setPrivacyCollection(checked);
    setPrivacy3rdParty(checked);
    setEventMarketing(checked);
  };

  return (
    <div className="fixed inset-0 bg-bluegray-1 z-50">
      {/* 헤더 */}
      <div className="bg-white">
        <AuthHeader currentStep={1} totalSteps={4} onBack={onClose} />
      </div>

      {/* 프로그레스 바 */}
      <ProgressBar currentStep={1} totalSteps={4} />

      {/* 콘텐츠 */}
      <div className="px-6 pt-12 pb-24 h-[calc(100vh-60px)] overflow-y-auto bg-white">
        <h1 className="text-[28px] font-bold text-text-black mb-16">약관에 동의해주세요</h1>

        {/* 약관 전체 동의 */}
        <label className="flex items-center gap-3 pb-6 mb-6 border-b-2 border-text-gray4">
          <input
            type="checkbox"
            checked={allAgree}
            onChange={(e) => handleAllAgree(e.target.checked)}
            className="w-6 h-6 accent-core-1"
          />
          <span className="text-title2 text-text-black font-semibold">약관 전체 동의</span>
        </label>

        {/* 개별 약관 */}
        <div className="space-y-5">
          {/* 만 14세 이상입니다 (필수) */}
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={age14}
              onChange={(e) => setAge14(e.target.checked)}
              className="w-6 h-6 accent-core-1"
            />
            <span className="text-title2 text-text-black">
              만 14세 이상입니다 <span className="text-core-1">(필수)</span>
            </span>
          </label>

          {/* 서비스 이용약관 동의 (필수) */}
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={serviceTerms}
              onChange={(e) => setServiceTerms(e.target.checked)}
              className="w-6 h-6 accent-core-1"
            />
            <span className="text-title2 text-text-black flex items-center flex-1 justify-between">
              서비스 이용약관 동의 <span className="text-core-1">(필수)</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 5L12.5 10L7.5 15"
                  stroke="#9B9BA1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </label>

          {/* 개인정보 수집/이용동의 (필수) */}
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={privacyCollection}
              onChange={(e) => setPrivacyCollection(e.target.checked)}
              className="w-6 h-6 accent-core-1"
            />
            <span className="text-title2 text-text-black flex items-center flex-1 justify-between">
              개인정보 수집/이용동의 <span className="text-core-1">(필수)</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 5L12.5 10L7.5 15"
                  stroke="#9B9BA1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </label>

          {/* 개인정보 제3자 제공 동의 (필수) */}
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={privacy3rdParty}
              onChange={(e) => setPrivacy3rdParty(e.target.checked)}
              className="w-6 h-6 accent-core-1"
            />
            <span className="text-title2 text-text-black flex items-center flex-1 justify-between">
              개인정보 제3자 제공 동의 <span className="text-core-1">(필수)</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 5L12.5 10L7.5 15"
                  stroke="#9B9BA1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </label>

          {/* 이벤트 혜택 및 광고성 정보 수신 동의 (선택) */}
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={eventMarketing}
              onChange={(e) => setEventMarketing(e.target.checked)}
              className="w-6 h-6 accent-text-gray3"
            />
            <span className="text-title2 text-text-gray3 flex items-center flex-1 justify-between">
              이벤트 혜택 및 광고성 정보 수신 동의 <span className="text-text-gray3">(선택)</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 5L12.5 10L7.5 15"
                  stroke="#9B9BA1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </label>

          {/* 하위 항목들 (들여쓰기) */}
          <div className="ml-9 space-y-4">
            <label className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 10L8 13L15 6"
                  stroke="#6666E5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-callout2 text-text-gray3">개인정보 이용 동의</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-auto"
              >
                <path
                  d="M6 4L10 8L6 12"
                  stroke="#9B9BA1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
            <label className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="4" width="12" height="12" rx="2" stroke="#D4D4D9" strokeWidth="1.5" />
              </svg>
              <span className="text-callout2 text-text-gray4">이메일/앱 푸시 수신 동의</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-auto"
              >
                <path
                  d="M6 4L10 8L6 12"
                  stroke="#9B9BA1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-text-gray5">
        <button
          disabled={!requiredChecked}
          onClick={() => {
            if (requiredChecked) {
              onNext();
            }
          }}
          className={`w-full h-14 rounded-2xl text-title font-semibold transition-all ${
            requiredChecked ? "bg-core-1 text-white" : "bg-text-gray5 text-text-gray4"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default AgreementForm;
