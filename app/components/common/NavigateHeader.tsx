import type { ReactNode } from "react";

type Props = {
  title: ReactNode; // 텍스트
  onBack?: () => void; //onBack={() => history.back()} 뒤로가기
  bgClassName?: string;
  titleClassName?: string;
};

export default function NavigationHeader({
  title,
  onBack,
  bgClassName,
  titleClassName,
}: Props) {
  const bg = bgClassName ?? "bg-[#FFFFFF]";

  return (
    <div
      className={`h-[60px] flex items-center bg-[#FFFFFF]  px-4 py-[10px] ${bg}`}
    >
      <button
        type="button"
        onClick={onBack}
        className="w-6 h-6 grid place-items-center text-gray2"
        aria-label="back"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M14.5 5.5L8.5 12l6 6.5"
            stroke="#5B5D6B"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="flex-1 text-center">
        <div className={`text-Title1 text-semiblod ${titleClassName ?? ""}`}>
          {title}
        </div>
      </div>

      {/* 오른쪽 여백 맞추기 */}
      <div className="w-6" />
    </div>
  );
}
