import { useState } from "react";
import type { FormProps } from "../types";
import {
  checkNicknameAvailability,
  sendVerificationEmail,
  verifyEmailCode,
  checkPasswordMatch,
} from "../utils";
import AuthHeader from "./AuthHeader";
import ProgressBar from "./ProgressBar";

function BasicInfoForm({ onClose, onNext }: FormProps) {
  const [firstName, setFirstName] = useState("");
  const [nickname, setNickname] = useState("");
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameError, setNicknameError] = useState("");

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 닉네임 중복 확인
  const checkNickname = async () => {
    const result = await checkNicknameAvailability(nickname);
    setNicknameError(result.message);
    setNicknameChecked(result.available);
  };

  // 이메일 인증하기
  const handleSendVerification = async () => {
    const success = await sendVerificationEmail(email);
    if (success) {
      setEmailVerified(false);
      setVerificationError("");
    }
  };

  // 인증 코드 확인
  const handleVerificationCodeChange = (code: string) => {
    setVerificationCode(code);
    if (code.length === 6) {
      const result = verifyEmailCode(code);
      setVerificationError(result.message);
      setEmailVerified(result.valid);
    } else {
      setVerificationError("");
      setEmailVerified(false);
    }
  };

  // 비밀번호 일치 확인
  const handlePasswordConfirmChange = (value: string) => {
    setPasswordConfirm(value);
    const result = checkPasswordMatch(password, value);
    setPasswordError(result.message);
  };

  const isFormValid =
    firstName.trim() &&
    nickname.trim() &&
    nicknameChecked &&
    email.trim() &&
    verificationCode.trim() &&
    emailVerified &&
    password.trim() &&
    passwordConfirm.trim() &&
    password === passwordConfirm;

  return (
    <div className="fixed inset-0 bg-bluegray-1 z-50">
      {/* 헤더 */}
      <div className="bg-white">
        <AuthHeader currentStep={2} totalSteps={4} onBack={onClose} />
      </div>

      {/* 프로그레스 바 */}
      <ProgressBar currentStep={2} totalSteps={4} />

      {/* 콘텐츠 */}
      <div className="px-6 pt-12 pb-24 h-[calc(100vh-60px)] overflow-y-auto bg-white">
        <h1 className="text-[28px] font-bold text-text-black mb-16">기본 정보를 입력해주세요</h1>

        {/* 이름 */}
        <div className="mb-8">
          <label className="text-title2 text-text-black font-semibold mb-3 block">이름</label>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="성함을 입력해주세요"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full h-14 px-5 bg-white border border-text-gray4 rounded-2xl text-title2 placeholder:text-text-gray4 focus:outline-none focus:border-core-1 transition-colors"
            />
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="닉네임을 입력해주세요"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setNicknameError("");
                  setNicknameChecked(false);
                }}
                className="flex-1 h-14 px-5 bg-white border border-text-gray4 rounded-2xl text-title2 placeholder:text-text-gray4 focus:outline-none focus:border-core-1 transition-colors"
              />
              <button
                onClick={checkNickname}
                className="h-14 px-6 bg-core-2 text-core-1 rounded-2xl text-title2 font-semibold whitespace-nowrap hover:bg-core-3"
              >
                중복확인
              </button>
            </div>
            {nicknameError && (
              <p className={`text-callout2 ${nicknameChecked ? "text-core-1" : "text-red-500"}`}>
                {nicknameError}
              </p>
            )}
          </div>
        </div>

        {/* 이메일 */}
        <div className="mb-8">
          <label className="text-title2 text-text-black font-semibold mb-3 block">이메일</label>
          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="이메일을 입력해주세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-14 px-5 bg-white border border-text-gray4 rounded-2xl text-title2 placeholder:text-text-gray4 focus:outline-none focus:border-core-1 transition-colors"
              />
              <button
                onClick={handleSendVerification}
                className="h-14 px-6 bg-core-2 text-core-1 rounded-2xl text-title2 font-semibold whitespace-nowrap hover:bg-core-3"
              >
                인증하기
              </button>
            </div>
            <input
              type="text"
              placeholder="인증코드 입력"
              value={verificationCode}
              onChange={(e) => handleVerificationCodeChange(e.target.value)}
              className="w-full h-14 px-5 bg-white border border-text-gray4 rounded-2xl text-title2 placeholder:text-text-gray4 focus:outline-none focus:border-core-1 transition-colors"
            />
            {verificationError && <p className="text-callout2 text-red-500">{verificationError}</p>}
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="mb-8">
          <label className="text-title2 text-text-black font-semibold mb-2 block">비밀번호</label>
          <p className="text-callout2 text-text-gray3 mb-3">
            *영문, 숫자, 특수 문자 중 2종류 이상을 조합하여 8-20자리로 설정
          </p>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 px-5 bg-white border border-text-gray4 rounded-2xl text-title2 placeholder:text-text-gray4 focus:outline-none focus:border-core-1 transition-colors"
            />
            <input
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              value={passwordConfirm}
              onChange={(e) => handlePasswordConfirmChange(e.target.value)}
              className="w-full h-14 px-5 bg-white border border-text-gray4 rounded-2xl text-title2 placeholder:text-text-gray4 focus:outline-none focus:border-core-1 transition-colors"
            />
            {passwordError && <p className="text-callout2 text-red-500">{passwordError}</p>}
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-text-gray5">
        <button
          disabled={!isFormValid}
          onClick={() => {
            if (isFormValid) {
              onNext();
            }
          }}
          className={`w-full h-14 rounded-2xl text-title font-semibold transition-all ${
            isFormValid ? "bg-core-1 text-white" : "bg-text-gray5 text-text-gray4"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default BasicInfoForm;
