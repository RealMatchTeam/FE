interface DateFieldProps {
  placeholder: string;
  value?: string;
  onClick: () => void;
}

// 날짜를 "YYYY년 M월 D일" 형식으로 변환하는 함수
function formatDateToKorean(dateString: string): string {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}년 ${month}월 ${day}일`;
  } catch {
    return dateString;
  }
}

export default function DateField({
  placeholder,
  value,
  onClick,
}: DateFieldProps) {
  const displayValue = value ? formatDateToKorean(value) : placeholder;

  return (
    <button
      onClick={onClick}
      className="flex items-center flex-1 h-[34px] px-4 gap-[10px] rounded-md border border-core-2 bg-white/80"
    >
      <span
        className={`text-title3 ${value ? "text-text-black" : "text-text-gray3"}`}
      >
        {displayValue}
      </span>
    </button>
  );
}
