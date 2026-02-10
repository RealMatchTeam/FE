interface FeeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  unit?: string;
}

// 숫자를 천 단위 콤마 형식으로 변환
const formatNumber = (num: string): string => {
  if (!num) return "";
  return Number(num).toLocaleString();
};

// 콤마가 포함된 문자열에서 숫자만 추출
const parseNumber = (str: string): string => {
  return str.replace(/[^0-9]/g, "");
};

export default function FeeInput({
  value,
  onChange,
  placeholder = "",
  unit = "원",
}: FeeInputProps) {
  const displayValue = formatNumber(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseNumber(e.target.value);
    onChange(rawValue);
  };

  return (
    <div className="relative flex items-center flex-1 h-[44px] px-4 rounded-md border border-core-2 bg-white/80">
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        className="flex-1 text-title3 text-text-black placeholder:text-text-gray3 focus:outline-none bg-transparent text-left"
        placeholder={placeholder}
      />
      <span className="absolute right-4 text-title3 text-text-black shrink-0 pointer-events-none">{unit}</span>
    </div>
  );
}
