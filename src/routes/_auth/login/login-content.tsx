import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import LoginLogo from "../../../assets/logo/login-logo.svg";
import { SocialLoginSection } from "./components/SocialLoginSection";

function LoginContent() {
  const navigate = useNavigate();
  const [lastProvider, setLastProvider] = useState<"kakao" | "naver" | "google" | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("lastLoginProvider") as "kakao" | "naver" | "google" | null;
    if (saved) {
      setLastProvider(saved);
    }
  }, []);

  const openSocialSignUp = (provider: "kakao" | "naver" | "google") => {
    localStorage.setItem("lastLoginProvider", provider);
    // 소셜 로그인/회원가입 시 provider 정보 전달 (Type 페이지 생략하고 Terms로 바로 이동)
    navigate({ to: "/auth/signup/terms", search: { provider } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-6 bg-grad-auth">
      {/* 로고 영역 */}
      <div className="flex flex-col items-center mb-12">
        <img src={LoginLogo} alt="Real Match Logo" className="mb-4" />
      </div>

      {/* 소셜 로그인 */}
      <SocialLoginSection
        onKakaoClick={() => openSocialSignUp("kakao")}
        onNaverClick={() => openSocialSignUp("naver")}
        onGoogleClick={() => openSocialSignUp("google")}
        lastProvider={lastProvider}
      />
    </div>
  );
}

export default LoginContent;
