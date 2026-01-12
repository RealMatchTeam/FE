import { useNavigate } from "@tanstack/react-router";
import RealMatchLogo from "../../assets/RealMatchLogo_ex.svg"

type RealMatchHeaderProps = {
  /** 뒤로가기 버튼 노출 여부 */
  showBack?: boolean;
  /** 뒤로가기 클릭 시 동작 커스텀 (없으면 navigate({to: ".."}) 시도 후 history.back) */
  onBack?: () => void;
};

export default function RealMatchHeader({
  showBack = true,
  onBack,
}: RealMatchHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) return onBack();

    // 가능하면 라우터 상위로, 실패하면 브라우저 히스토리
    try {
      navigate({ to: ".." });
    } catch {
      window.history.back();
    }
  };

  return (
<header className="h-[56px] w-full bg-white">
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
              {/* iOS 느낌 chevron */}
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
        <div className="flex items-center justify-center gap-2">
          <img
            src= {RealMatchLogo}
            alt="Real Match"
            draggable={false}
          />
        </div>
      </div>

      {/* 하단 얇은 divider (스크린샷의 라인 느낌) */}
  <div className="h-px w-full bg-black/5" />
    </header>
  );
}