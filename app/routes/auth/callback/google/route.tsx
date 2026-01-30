import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuthStore } from "../../../../stores/auth-store";
import { apiClient } from "../../../../lib/api-client";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setTokens, setMe } = useAuthStore();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      navigate("/login");
      return;
    }

    const handleCallback = async () => {
      try {
        const response = await apiClient.post("/auth/google/callback", { code });
        const { accessToken, refreshToken, user } = response.data;
        setTokens(accessToken, refreshToken);
        setMe(user);
        navigate("/");
      } catch (error) {
        console.error("Google callback error:", error);
        navigate("/login");
      }
    };

    handleCallback();
  }, [searchParams, navigate, setTokens, setMe]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <p>로그인 처리 중...</p>
      </div>
    </div>
  );
}
