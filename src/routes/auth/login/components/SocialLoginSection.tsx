interface SocialLoginSectionProps {
  onKakaoClick: () => void;
  onNaverClick: () => void;
}

export function SocialLoginSection({ onKakaoClick, onNaverClick }: SocialLoginSectionProps) {
  return (
    <div className="flex space-x-12">
      {/* 카카오 로그인 */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={onKakaoClick}
          className="w-14 h-14 rounded-full bg-[#FEE500] flex items-center justify-center cursor-pointer hover:brightness-95 transition-all"
          aria-label="카카오 로그인"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3C6.48 3 2 6.58 2 11C2 13.84 3.94 16.32 6.84 17.72L5.72 21.44C5.64 21.72 5.96 21.96 6.2 21.8L10.68 18.84C11.12 18.92 11.56 18.96 12 18.96C17.52 18.96 22 15.38 22 10.96C22 6.58 17.52 3 12 3Z"
              fill="#3C1E1E"
            />
          </svg>
        </button>
        <span className="text-callout1 text-text-gray3">카카오로 시작</span>
      </div>

      {/* 네이버 로그인 */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={onNaverClick}
          className="w-14 h-14 rounded-full bg-[#03C75A] flex items-center justify-center cursor-pointer hover:brightness-95 transition-all"
          aria-label="네이버 로그인"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M13.56 10.68L6.2 0H0V20H6.44V9.32L13.8 20H20V0H13.56V10.68Z"
              fill="white"
            />
          </svg>
        </button>
        <span className="text-callout1 text-text-gray3">네이버로 시작</span>
      </div>
    </div>
  );
}
