interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBackClick?: () => void;
  rightElement?: React.ReactNode;
}

export default function Header({
  title,
  showBack = true,
  onBackClick,
  rightElement,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full h-[60px] bg-white border-b border-text-gray5 safe-area-top">
      {/* 실제 네비게이션 영역 */}
      <div className="relative flex items-center justify-between h-full px-4">
        {/* 왼쪽: 뒤로가기 */}
        <div className="flex items-center">
          {showBack && (
            <button
              onClick={onBackClick}
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              aria-label="뒤로가기"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-[#222]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          )}
        </div>

        {/* 중앙: 타이틀 */}
        {title && (
          <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[16px] font-bold text-[#222]">
            {title}
          </h1>
        )}

        {/* 오른쪽 */}
        <div className="flex items-center">{rightElement}</div>
      </div>
    </header>
  );
}
