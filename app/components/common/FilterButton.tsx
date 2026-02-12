interface FilterButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  isActive?: boolean;
}

// 글자수 초과시 ""..." 처리
const truncateLabel = (text: string, maxLength = 10) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

export default function FilterButton({
  label,
  isActive,
  className = "",
  ...props
}: FilterButtonProps) {
  return (
    <button
      className={`flex items-center w-fit h-7 pl-3 pr-1.5 rounded-full border transition-colors cursor-pointer text-[14px] font-Pretendard ${
        isActive
          ? "border-core-3 text-core-1 bg-core-2 font-medium"
          : "border-core-2 text-text-gray2 bg-white text-title3"
      } ${className}`}
      {...props}
    >
      {truncateLabel(label)}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="none"
        className="w-6 h-6 text-current"
      >
        <path
          d="M6 8L10 12L14 8"
          stroke="currentColor"
          strokeWidth="1.0"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
