interface SelectFieldProps {
  label: string;
  valueText?: string;
  onOpen: () => void;
}

export default function SelectField({
  label,
  valueText,
  onOpen,
}: SelectFieldProps) {
  const isSelected = Boolean(valueText);
  const displayText = valueText ?? "선택하기";

  return (
    <div
      className={[
        "flex flex-col items-center justify-center",
        "w-[343px] h-[52px]",
        "bg-white border rounded-lg",
        "border-text-gray4",
        "text-center",
      ].join(" ")}
    >
      <span
        className={[
          "inline-flex items-center justify-center",
          "w-[55px] h-[16px]",
          "text-[12px] leading-[16px] font-medium",
          "text-text-gray3",
        ].join(" ")}
      >
        {label}
      </span>

      <button
        type="button"
        onClick={onOpen}
        className={[
          "inline-flex items-center justify-center",
          "w-[42px] h-[18px]",
          "text-[12px] leading-[18px] font-light",
          isSelected ? "text-text-black" : "text-core-1",
          "active:opacity-90",
        ].join(" ")}
      >
        {displayText}
      </button>
    </div>
  );
}
