interface TextInputProps {
  placeholder: string;
  maxLength: number;
  value: string;
  onChange: (value: string) => void;
}

export default function TextInput({
  placeholder,
  maxLength,
  value,
  onChange,
}: TextInputProps) {
  return (
    <div className="flex items-center w-full h-[44px] px-4 gap-[10px] rounded-md border border-core-2 bg-white/80">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        className="flex-1 bg-transparent text-title3 text-text-black placeholder:text-text-gray3 focus:outline-none"
      />
      <span className="text-callout1 text-text-gray3 shrink-0">
        {value.length}/{maxLength}
      </span>
    </div>
  );
}
