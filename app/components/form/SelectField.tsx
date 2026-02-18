interface SelectFieldProps {
  placeholder: string;
  value?: string;
  onClick: () => void;
  noTruncate?: boolean;
}

export default function SelectField({
  placeholder,
  value,
  onClick,
  noTruncate = false,
}: SelectFieldProps) {
  // 12글자 이상이면 ...으로 표시 (noTruncate가 false일 때만)
  const displayValue = !noTruncate && value && value.length > 12 ? `${value.slice(0, 12)}...` : value;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between w-full h-[44px] pl-4 pr-1 gap-[10px] rounded-md border border-core-2 bg-white/80"
    >
      <span
        className={`text-title3 ${value ? "text-text-black" : "text-text-gray3"}`}
      >
        {displayValue || placeholder}
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M7 18L12.5 12L7 6" stroke="#9B9BA1" strokeWidth="1.5" />
      </svg>
    </button>
  );
}
