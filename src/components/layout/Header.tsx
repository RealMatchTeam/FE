interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBackClick?: () => void;
  rightElement?: React.ReactNode;
}

export default function Header({
  title,
  showBack = false,
  onBackClick,
  rightElement,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-[107px] px-4 bg-white border-b border-text-gray5 safe-area-top">
      {/* 왼쪽: 뒤로가기 버튼 */}
      <div className="flex items-center">
        {showBack && (
          <button
            onClick={onBackClick}
            className="flex items-center justify-center w-8 h-8 text-text-black hover:bg-bluegray-1 rounded-lg transition-colors"
            aria-label="뒤로가기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
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
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-title1 text-text-black">
          {title}
        </h1>
      )}

      {/* 오른쪽: 커스텀 엘리먼트 */}
      <div className="flex items-center">{rightElement}</div>
    </header>
  );
}
