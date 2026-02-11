import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { jwtDecode } from "jwt-decode";
import { tokenStorage } from "../../../../lib/token";
import { useAuthStore } from "../../../../stores/auth-store";

interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  role: string;
}

export default function NaverCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const setMe = useAuthStore((s) => s.setMe);


  useEffect(() => {
    const accessToken = searchParams.get("accessToken") || searchParams.get("access_token");
    const refreshToken = searchParams.get("refreshToken") || searchParams.get("refresh_token");

    if (accessToken && refreshToken) {
      console.log("[Naver Callback] Tokens received, storing and navigating...");
      tokenStorage.setTokens(accessToken, refreshToken);
      localStorage.setItem("lastLoginProvider", "naver");

      try {
        const decoded = jwtDecode<JwtPayload>(accessToken);
        if (decoded.role === "GUEST") {
          setMe({
            id: decoded.sub,
            name: decoded.name,
            email: decoded.email,
          });
          navigate(`/auth/signup/terms?provider=naver`);
        } else {
          // 유저 정보 store에 저장
          setMe({
            id: decoded.sub,
            name: decoded.name,
            email: decoded.email,
          });
          navigate("/");
        }
      } catch (e) {
        console.error("Token decode failed", e);
        navigate("/");
      }
      return;
    }

    if (!code) {
      console.error("No code found in callback");
      navigate("/auth/login");
      return;
    }

    if (code) {
      console.log("[Naver] Code present but no token.");
    }
  }, [code, navigate, searchParams, setMe]);


  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">네이버 로그인 진행중...</div>
    </div>
  );
}
