interface FormFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onClick: () => void;
}

export default function FormField({
  label,
  value,
  placeholder,
  onClick,
}: FormFieldProps) {
  const hasValue = value.trim().length > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full",
        "h-[52px]",
        "bg-white",
        "rounded-[12px]",
        "border border-core-2",
        "px-4",
        "active:opacity-90 transition-opacity",
        hasValue
          ? "flex items-center justify-center"
          : "flex flex-col items-center justify-center",
      ].join(" ")}
    >
      {!hasValue ? (
        <div className="flex w-full flex-col items-center justify-center gap-[2px]">
          <span className="text-callout1 leading-[16px] text-text-gray3">
            {label}
          </span>
          <span className="font-light text-[12px] leading-[16px] text-core-1">
            {placeholder}
          </span>
        </div>
      ) : (
        <span className="text-callout1 leading-[20px] text-core-1 text-center whitespace-pre-line
">
          {value}
        </span>
      )}
    </button>
  );
}
