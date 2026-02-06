interface SocialLoginSectionProps {
  lastProvider?: "kakao" | "naver" | "google" | null;
}

const Tooltip = () => (
  <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-max animate-slide-up z-10">
    <div className="relative bg-white px-2 py-1 rounded-[8px] shadow-md border border-gray-100">
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-gray-100 rotate-45" />
      <span className="text-callout1 text-text-black relative z-10">가장 최근 로그인했어요</span>
    </div>
  </div>
);

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function SocialLoginSection({ lastProvider }: SocialLoginSectionProps) {
  const handleKakaoLogin = () => {
    const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI || `${window.location.origin}/auth/callback/kakao`;
    window.location.href = `${BASE_URL}/oauth2/authorization/kakao?redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  const handleNaverLogin = () => {
    const redirectUri = import.meta.env.VITE_NAVER_REDIRECT_URI || `${window.location.origin}/auth/callback/naver`;
    window.location.href = `${BASE_URL}/oauth2/authorization/naver?redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  const handleGoogleLogin = () => {
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/callback/google`;
    window.location.href = `${BASE_URL}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <span className="text-text-gray3 text-title3">SNS 계정으로 간편 로그인 하기</span>

      <div className="flex gap-5">
        {/* 카카오 로그인 */}
        <div className="relative flex flex-col items-center">
          <button
            type="button"
            onClick={handleKakaoLogin}
            className="w-[52px] h-[52px] rounded-full bg-[#FEE500] flex items-center justify-center transition-transform hover:scale-105"
            aria-label="카카오 로그인"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 4C7.58172 4 4 6.98528 4 10.6667C4 12.9733 5.39757 14.9976 7.55523 16.1437L6.87856 18.6796C6.79758 18.9839 7.1264 19.2319 7.39121 19.0664L10.9859 16.8202C11.3175 16.864 11.6558 16.8889 12 16.8889C16.4183 16.8889 20 13.9036 20 10.2222C20 6.54086 16.4183 4 12 4Z"
                fill="#000000"
              />
            </svg>
          </button>
          {lastProvider === "kakao" && <Tooltip />}
        </div>

        {/* 네이버 로그인 */}
        <div className="relative flex flex-col items-center">
          <button
            type="button"
            onClick={handleNaverLogin}
            className="w-[52px] h-[52px] rounded-full bg-[#03C75A] flex items-center justify-center transition-transform hover:scale-105"
            aria-label="네이버 로그인"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.869 10.1584L7.15243 2H2V18H7.13098V9.84156L12.8476 18H18V2H12.869V10.1584Z"
                fill="white"
              />
            </svg>
          </button>
          {lastProvider === "naver" && <Tooltip />}
        </div>

        {/* 구글 로그인 */}
        <div className="relative flex flex-col items-center">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-[52px] h-[52px] rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm transition-transform hover:scale-105"
            aria-label="구글 로그인"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </button>
          {lastProvider === "google" && <Tooltip />}
        </div>
      </div>
    </div>
  );
}
