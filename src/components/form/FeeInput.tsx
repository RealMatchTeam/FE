interface FeeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  unit?: string;
}

export default function FeeInput({
  value,
  onChange,
  placeholder = "",
  unit = "원",
}: FeeInputProps) {
  return (
    <div className="flex items-center flex-1 h-[34px] px-4 gap-[10px] rounded-md border border-core-2 bg-white/80">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
        className="flex-1 text-title3 text-text-black placeholder:text-text-gray3 focus:outline-none bg-transparent text-right"
        placeholder={placeholder}
      />
      <span className="text-title3 text-text-black shrink-0">{unit}</span>
    </div>
  );
}
