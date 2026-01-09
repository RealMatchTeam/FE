import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_auth/login")({
  component: LoginPage,
});

function Toast({ message, onClear }: { message: string | null; onClear: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClear, 2000);
    return () => clearTimeout(t);
  }, [message, onClear]);
  if (!message) return null;
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-24 bg-black text-white px-4 py-2 rounded-md shadow-md">
      {message}
    </div>
  );
}

function SignUpChoice({
  onBrand,
  onCreator,
}: {
  onBrand: () => void;
  onCreator: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-bluegray-1 z-50 px-4 pt-40 pb-10">
      <h2 className="text-[28px] font-bold text-text-black text-center mb-32">
        가입 유형을 선택해주세요
      </h2>
      <div className="space-y-6 max-w-sm mx-auto">
        <button
          onClick={onCreator}
          className="w-full h-[168px] bg-core-2 rounded-[32px] flex items-center justify-center gap-4 transition-all active:scale-[0.98] hover:bg-core-3"
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4L28.4 16.8H41.6L31.6 24L36 36.8L24 28L12 36.8L16.4 24L6.4 16.8H19.6L24 4Z" stroke="#6666E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <circle cx="24" cy="32" r="8" stroke="#6666E5" strokeWidth="2.5" fill="none"/>
            <path d="M24 38C24 38 18 42 18 44C18 45.1046 20.6863 46 24 46C27.3137 46 30 45.1046 30 44C30 42 24 38 24 38Z" stroke="#6666E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <span className="text-[32px] font-bold text-core-1">크리에이터</span>
        </button>
        <button
          onClick={onBrand}
          className="w-full h-[168px] bg-core-2 rounded-[32px] flex items-center justify-center gap-4 transition-all active:scale-[0.98] hover:bg-core-3"
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="12" width="32" height="32" rx="2" stroke="#6666E5" strokeWidth="2.5" fill="none"/>
            <rect x="12" y="16" width="4" height="4" fill="#6666E5"/>
            <rect x="20" y="16" width="4" height="4" fill="#6666E5"/>
            <rect x="28" y="16" width="4" height="4" fill="#6666E5"/>
            <rect x="12" y="24" width="4" height="4" fill="#6666E5"/>
            <rect x="20" y="24" width="4" height="4" fill="#6666E5"/>
            <rect x="28" y="24" width="4" height="4" fill="#6666E5"/>
            <rect x="12" y="32" width="4" height="4" fill="#6666E5"/>
            <rect x="28" y="32" width="4" height="4" fill="#6666E5"/>
            <rect x="18" y="36" width="12" height="8" fill="#6666E5"/>
          </svg>
          <span className="text-[32px] font-bold text-core-1">브랜드</span>
        </button>
      </div>
    </div>
  );
}

function CreatorForm({ onClose, onNext }: { onClose: () => void; onNext: () => void }) {
  const [allAgree, setAllAgree] = useState(false);
  const [age14, setAge14] = useState(false);
  const [serviceTerms, setServiceTerms] = useState(false);
  const [privacyCollection, setPrivacyCollection] = useState(false);
  const [privacy3rdParty, setPrivacy3rdParty] = useState(false);
  const [eventMarketing, setEventMarketing] = useState(false);

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
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* 헤더 */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-text-gray5">
        <button onClick={onClose} className="p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#171718" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="text-body1 text-text-gray3">1 / 4</span>
      </div>

      {/* 프로그레스 바 */}
      <div className="h-1 bg-text-gray5">
        <div className="h-full bg-core-1 transition-all" style={{ width: '25%' }} />
      </div>

      {/* 콘텐츠 */}
      <div className="px-6 pt-12 pb-24 h-[calc(100vh-60px)] overflow-y-auto">
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
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="#9B9BA1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="#9B9BA1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="#9B9BA1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="#9B9BA1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </label>

          {/* 하위 항목들 (들여쓰기) */}
          <div className="ml-9 space-y-4">
            <label className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 10L8 13L15 6" stroke="#6666E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-callout2 text-text-gray3">개인정보 이용 동의</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-auto">
                <path d="M6 4L10 8L6 12" stroke="#9B9BA1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </label>
            <label className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="12" height="12" rx="2" stroke="#D4D4D9" strokeWidth="1.5"/>
              </svg>
              <span className="text-callout2 text-text-gray4">이메일/앱 푸시 수신 동의</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-auto">
                <path d="M6 4L10 8L6 12" stroke="#9B9BA1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
            requiredChecked ? 'bg-core-1 text-white' : 'bg-text-gray5 text-text-gray4'
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}

function Step2Form({ onClose, onNext }: { onClose: () => void; onNext: () => void }) {
  const [firstName, setFirstName] = useState('');
  const [nickname, setNickname] = useState('');
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameError, setNicknameError] = useState('');
  
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 닉네임 중복 확인
  const checkNickname = () => {
    if (!nickname.trim()) return;
    // 임시로 "비비킹" 이면 중복으로 처리
    if (nickname === '비비킹') {
      setNicknameError('*이미 존재하는 닉네임입니다');
      setNicknameChecked(false);
    } else {
      setNicknameError('*사용 가능한 닉네임입니다');
      setNicknameChecked(true);
    }
  };

  // 이메일 인증하기
  const sendVerification = () => {
    if (!email.trim()) return;
    // 실제로는 백엔드에 인증 코드 전송 요청
    setEmailVerified(false);
    setVerificationError('');
  };

  // 인증 코드 확인 (자동 검증 예시)
  const handleVerificationCodeChange = (code: string) => {
    setVerificationCode(code);
    if (code.length === 6) {
      // 임시로 "G12345"가 아니면 에러
      if (code !== 'G12346') {
        setVerificationError('*인증코드가 올바르지 않습니다');
        setEmailVerified(false);
      } else {
        setVerificationError('');
        setEmailVerified(true);
      }
    } else {
      setVerificationError('');
      setEmailVerified(false);
    }
  };

  // 비밀번호 일치 확인
  const handlePasswordConfirmChange = (value: string) => {
    setPasswordConfirm(value);
    if (value && password && value !== password) {
      setPasswordError('*비밀번호가 같지 않습니다');
    } else {
      setPasswordError('');
    }
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
    <div className="fixed inset-0 bg-white z-50">
      {/* 헤더 */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-text-gray5">
        <button onClick={onClose} className="p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#171718" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="text-body1 text-text-gray3">2 / 4</span>
      </div>

      {/* 프로그레스 바 */}
      <div className="h-1 bg-text-gray5">
        <div className="h-full bg-core-1 transition-all" style={{ width: '50%' }} />
      </div>

      {/* 콘텐츠 */}
      <div className="px-6 pt-12 pb-24 h-[calc(100vh-60px)] overflow-y-auto">
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
                  setNicknameError('');
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
              <p className={`text-callout2 ${nicknameChecked ? 'text-core-1' : 'text-red-500'}`}>
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
                onClick={sendVerification}
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
            {verificationError && (
              <p className="text-callout2 text-red-500">{verificationError}</p>
            )}
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
            {passwordError && (
              <p className="text-callout2 text-red-500">{passwordError}</p>
            )}
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
            isFormValid ? 'bg-core-1 text-white' : 'bg-text-gray5 text-text-gray4'
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}

function LoginPage() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showCreator, setShowCreator] = useState(false);
  const [showStep2, setShowStep2] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const openSignUp = () => setShowSignUp(true);
  const handleBrand = () => {
    setToast("준비중입니다!");
    setShowSignUp(false);
  };
  const handleCreator = () => {
    setShowSignUp(false);
    setShowCreator(true);
  };
  const handleStep1Next = () => {
    setShowCreator(false);
    setShowStep2(true);
  };
  const handleStep2Next = () => {
    // 임시로 닫기 (나중에 Step 3로 이동)
    setShowStep2(false);
    setToast("회원가입이 완료되었습니다!");
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 pt-32 pb-10 bg-bluegray-1">
      {/* 로고 영역 */}
      <div className="flex flex-col items-center mb-12">
        <div className="mb-4">
          <svg
            width="80"
            height="44"
            viewBox="0 0 80 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 10C15.3726 10 10 15.3726 10 22C10 28.6274 15.3726 34 22 34C28.6274 34 34 28.6274 34 22C34 19 36 14 46 14C56 14 58 19 58 22C58 28.6274 63.3726 34 70 34C76.6274 34 82 28.6274 82 22C82 15.3726 76.6274 10 70 10C63.3726 10 58 15.3726 58 22C58 25 56 30 46 30C36 30 34 25 34 22C34 15.3726 28.6274 10 22 10Z"
              stroke="#6666E5"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="text-[32px] font-bold text-core-1 tracking-tight">Real Match</h1>
      </div>

      {/* 입력 영역 */}
      <div className="w-full max-w-sm space-y-3">
        <div className="relative">
          <input
            type="email"
            placeholder="이메일 입력"
            className="w-full h-[56px] px-5 bg-white border border-core-2 rounded-2xl text-title2 placeholder:text-text-gray4 focus:outline-none focus:border-core-1 transition-colors"
          />
        </div>
        <div className="relative">
          <input
            type="password"
            placeholder="비밀번호 입력"
            className="w-full h-[56px] px-5 bg-white border border-core-2 rounded-2xl text-title2 placeholder:text-text-gray4 focus:outline-none focus:border-core-1 transition-colors"
          />
        </div>
      </div>

      {/* 로그인 버튼 및 링크 */}
      <div className="w-full max-w-sm mt-8">
        <button className="w-full h-[56px] bg-core-1 text-white text-title font-semibold rounded-2xl transition-all hover:brightness-105 active:scale-[0.98]">
          로그인
        </button>

        <div className="flex justify-center items-center mt-6 space-x-3 text-callout2 text-text-gray3">
          <button className="hover:text-text-gray2">아이디 찾기</button>
          <span className="w-[1px] h-3 bg-text-gray4" />
          <button className="hover:text-text-gray2">비밀번호 찾기</button>
          <span className="w-[1px] h-3 bg-text-gray4" />
          <button onClick={openSignUp} className="hover:text-text-gray2">
            회원가입
          </button>
        </div>
      </div>

      {/* 구분선 */}
      <div className="w-full max-w-sm flex items-center my-10 px-2">
        <div className="flex-1 h-[1px] bg-text-gray4" />
        <span className="px-4 text-callout2 text-text-gray3">또는</span>
        <div className="flex-1 h-[1px] bg-text-gray4" />
      </div>

      {/* 소셜 로그인 */}
      <div className="flex space-x-12">
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={openSignUp}
            className="w-[64px] h-[64px] bg-[#FEE500] rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-sm"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 0.8C5.372 0.8 0 4.951 0 10.07C0 13.253 2.078 16.06 5.242 17.729L3.911 22.593C3.793 23.022 4.285 23.365 4.662 23.116L10.498 19.264C10.99 19.312 11.491 19.34 12 19.34C18.627 19.34 24 15.189 24 10.07C24 4.951 18.627 0.8 12 0.8Z" fill="black" fillOpacity="0.85"/>
            </svg>
          </button>
          <span className="text-callout2 text-text-gray2 font-medium">카카오로 시작</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={openSignUp}
            className="w-[64px] h-[64px] bg-[#03C75A] rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-sm"
          >
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.561 10.703L6.146 0H0V20H6.439V9.295L13.854 20H20V0H13.561V10.703Z" fill="white"/>
            </svg>
          </button>
          <span className="text-callout2 text-text-gray2 font-medium">네이버로 시작</span>
        </div>
      </div>

      {/* Overlays */}
      {showSignUp && (
        <SignUpChoice onBrand={handleBrand} onCreator={handleCreator} />
      )}
      {showCreator && <CreatorForm onClose={() => setShowCreator(false)} onNext={handleStep1Next} />}
      {showStep2 && <Step2Form onClose={() => setShowStep2(false)} onNext={handleStep2Next} />}

      <Toast message={toast} onClear={() => setToast(null)} />
    </div>
  );
}
