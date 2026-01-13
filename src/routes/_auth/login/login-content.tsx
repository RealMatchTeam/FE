import { useState } from "react";
import LoginLogo from "../../../assets/login-logo.svg";
import SignUpChoice from "../../../components/common/SignUpChoice";
import Button from "../../../components/common/Button";
import { SocialLoginButton, AgreementForm, BasicInfoForm } from "../components";

function LoginContent() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showCreator, setShowCreator] = useState(false);
  const [showStep2, setShowStep2] = useState(false);

  const openSignUp = () => setShowSignUp(true);
  
  const handleBrand = () => {
    alert("준비중입니다!");
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
    alert("회원가입이 완료되었습니다!");
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 pt-32 pb-10 bg-bluegray-1">
      {/* 로고 영역 */}
      <div className="flex flex-col items-center mb-12">
        <img src={LoginLogo} alt="Real Match Logo" className="mb-4" />
      </div>

      {/* 입력 영역 */}
      <div className="w-full max-w-sm space-y-3">
        <div className="relative">
          <input
            type="email"
            placeholder="이메일 입력"
            className="w-full h-14 px-5 bg-white border border-core-2 rounded-2xl text-title2 placeholder:text-text-gray4 focus:outline-none focus:border-core-1 transition-colors"
          />
        </div>
        <div className="relative">
          <input
            type="password"
            placeholder="비밀번호 입력"
            className="w-full h-14 px-5 bg-white border border-core-2 rounded-2xl text-title2 placeholder:text-text-gray4 focus:outline-none focus:border-core-1 transition-colors"
          />
        </div>
      </div>

      {/* 로그인 버튼 및 링크 */}
      <div className="w-full max-w-sm mt-8">
        <Button variant="primary" size="lg" fullWidth>
          로그인
        </Button>

        <div className="flex justify-center items-center mt-6 space-x-3 text-callout2 text-text-gray3">
          <button className="hover:text-text-gray2">아이디 찾기</button>
          <span className="w-px h-3 bg-text-gray4" />
          <button className="hover:text-text-gray2">비밀번호 찾기</button>
          <span className="w-px h-3 bg-text-gray4" />
          <button onClick={openSignUp} className="hover:text-text-gray2">
            회원가입
          </button>
        </div>
      </div>

      {/* 구분선 */}
      <div className="w-full max-w-sm flex items-center my-10 px-2">
        <div className="flex-1 h-px bg-text-gray4" />
        <span className="px-4 text-callout2 text-text-gray3">또는</span>
        <div className="flex-1 h-px bg-text-gray4" />
      </div>

      {/* 소셜 로그인 */}
      <div className="flex space-x-12">
        <SocialLoginButton provider="kakao" onClick={openSignUp} />
        <SocialLoginButton provider="naver" onClick={openSignUp} />
      </div>

      {/* Overlays */}
      {showSignUp && <SignUpChoice onBrand={handleBrand} onCreator={handleCreator} />}
      {showCreator && <AgreementForm onClose={() => setShowCreator(false)} onNext={handleStep1Next} />}
      {showStep2 && <BasicInfoForm onClose={() => setShowStep2(false)} onNext={handleStep2Next} />}
    </div>
  );
}

export default LoginContent;
