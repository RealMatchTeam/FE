import { useState } from "react";
import { useSearchParams } from "react-router";
import LoginLogo from "../../../assets/logo/login-logo.svg";
import { SocialLoginSection } from "./components/SocialLoginSection";

function LoginContent() {
  const [searchParams] = useSearchParams();
  const isWithdrawn = searchParams.get("withdrawn") === "true";

  const [lastProvider] = useState<"kakao" | "naver" | "google" | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lastLoginProvider") as "kakao" | "naver" | "google" | null;
    }
    return null;
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-6 bg-grad-auth">
      {/* 로고 영역 */}
      <div className="flex flex-col items-center mb-12">
        <img
          src={LoginLogo}
          alt="Real Match Logo"
          className="mb-4"
        />
      </div>

      {/* 소셜 로그인 */}
      <SocialLoginSection
        lastProvider={isWithdrawn ? null : lastProvider}
        isWithdrawn={isWithdrawn}
      />
    </div>
  );
}


export default LoginContent;
