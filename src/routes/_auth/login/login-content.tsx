import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import LoginLogo from "../../../assets/logo/login-logo.svg";
import { SocialLoginSection } from "./components/SocialLoginSection";

function LoginContent() {
  const navigate = useNavigate();
  const [lastProvider] = useState<"kakao" | "naver" | "google" | null>(() => {
    return localStorage.getItem("lastLoginProvider") as "kakao" | "naver" | "google" | null;
  });

  const openSocialSignUp = (provider: "kakao" | "naver" | "google") => {
    localStorage.setItem("lastLoginProvider", provider);
    navigate({ to: "/signup/terms", search: { provider } });
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
