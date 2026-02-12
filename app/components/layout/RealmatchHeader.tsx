import { useNavigate } from "react-router";
import RealMatchLogo from "../../assets/logo/realmatch-logo-line.png"
import bellIcon from "../../assets/icon/icon-bell.svg";
import redDot from "../../assets/icon/red-dot.svg";

type RealMatchHeaderProps = {
  /** 뒤로가기 버튼 노출 여부 */
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  hasNotification?: boolean;
};

export default function RealMatchHeader({
  showBack = true,
  onBack,
  hasNotification = true,
}: RealMatchHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) return onBack();
    // 브라우저 히스토리 뒤로가기
    navigate(-1);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shrink-0 border-b border-black/5 h-[100px] py-[18px]">
      <div className="grid h-full w-full grid-cols-3 items-center px-4">
        {/* Left: Back */}
        <div className="flex items-center">
          {showBack ? (
            <button
              type="button"
              onClick={handleBack}
              aria-label="뒤로가기"
              className="flex h-9 w-9 items-center justify-center rounded-full active:bg-black/5"
            >
              {/* chevron */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M14.5 5.5L8.5 12l6 6.5"
                  stroke="#5B63FF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : null}
        </div>

        {/* Center: Logo + Text */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2"
          >
            <img src={RealMatchLogo} alt="Real Match" draggable={false} />
          </button>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => navigate("/notification")}
            className="relative flex h-9 w-9 items-center justify-center rounded-full active:bg-black/5"
          >
            {/* 벨 아이콘 */}
            <img 
              src={bellIcon} 
              alt="알림" 
              className="w-6 h-6 object-contain"
              onError={(e) => console.error("벨 아이콘 로드 실패:", e)} 
            />

            {/* 알림이 있을 때만 빨간 점 노출 */}
            {hasNotification === true && (
              <img 
                src={redDot} 
                alt="" 
                className="absolute top-[8px] right-[8px] w-2 h-2" 
                onError={(e) => console.error("레드닷 로드 실패:", e)}
              />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}