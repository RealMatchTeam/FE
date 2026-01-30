import { useNavigate } from "@tanstack/react-router";
import arrowLeftIcon from "../../assets/icon/arrow-left.svg";

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
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      // 기본 동작: 이전 페이지로 이동
      navigate({ to: ".." }); 
    }
  };
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-[60px] px-[16px] py-[10px] bg-white border-b border-[var(--color-text-gray5)]">
      <div className="flex items-center w-8">
        {showBack && (
          <button
            onClick={handleBack} // 수정된 부분
            className="flex items-center justify-start active:opacity-50 transition-opacity"
            aria-label="뒤로가기"
          >
            {/* assets의 화살표 아이콘 사용 + 왼쪽으로 회전 */}
            <img 
              src={arrowLeftIcon} 
              alt="back" 
              className="w-6 h-6 brightness-0"
            />
          </button>
        )}
      </div>

      {/* 중앙: 타이틀 */}
      {title && (
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-title1 text-[var(--color-text-black)] whitespace-nowrap">
          {title}
        </h1>
      )}

      {/* 오른쪽: 커스텀 엘리먼트 영역 */}
      <div className="flex items-center justify-end w-8">
        {rightElement}
      </div>
    </header>
  );
}