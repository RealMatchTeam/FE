import { useState } from "react";
import { useNavigate } from "react-router";
import LoginLogo from "../../assets/logo/login-logo.svg";
import { SocialLoginSection } from "./components/SocialLoginSection";
import { getKakaoAuthUrl, getNaverAuthUrl, getGoogleAuthUrl } from "../../../utils/social-auth";

function LoginContent() {
  const navigate = useNavigate();
  const [lastProvider] = useState<"kakao" | "naver" | "google" | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lastLoginProvider") as "kakao" | "naver" | "google" | null;
    }
    return null;
  });

  const openSocialSignUp = (provider: "kakao" | "naver" | "google") => {
    localStorage.setItem("lastLoginProvider", provider);

    if (provider === "kakao") {
      const authUrl = getKakaoAuthUrl();
      if (authUrl !== "#") {
        window.location.href = authUrl;
        return;
      }
    }

    if (provider === "naver") {
      const authUrl = getNaverAuthUrl();
      if (authUrl !== "#") {
        window.location.href = authUrl;
        return;
      }
    }

    if (provider === "google") {
      const authUrl = getGoogleAuthUrl();
      if (authUrl !== "#") {
        window.location.href = authUrl;
        return;
      }
    }

    // 소셜 로그인/회원가입 시 provider 정보 전달
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
