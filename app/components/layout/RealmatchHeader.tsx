import { useNavigate } from "react-router";
import RealMatchLogo from "../../assets/logo/realmatch-logo-line.png"

type RealMatchHeaderProps = {
  /** 뒤로가기 버튼 노출 여부 */
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
};

export default function RealMatchHeader({
  showBack = true,
  onBack,
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

        {/* Center: Logo + Text (정중앙 고정) */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2"
        >
          <img
            src={RealMatchLogo}
            alt="Real Match"
            draggable={false}
          />
        </button>
      </div>
    </header>
  );
}