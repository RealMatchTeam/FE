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
        "w-full bg-white",
        "rounded-[12px] border border-core-2",
        "px-4",
        hasValue ? "min-h-[46px] py-2" : "h-[52px]",
        "active:opacity-90 transition-[height] duration-150",
        hasValue
          ? "flex items-center justify-center"
          : "flex flex-col items-center justify-center",
      ].join(" ")}
    >
      {!hasValue ? (
        <div className="flex w-full flex-col items-center justify-center gap-[2px] pt-[10px] pb-[6px]">
          <span className="text-[12px] leading-[16px] font-medium text-text-gray3">
            {label}
          </span>
          <span className="text-title1 text-core-1">{placeholder}</span>
        </div>
      ) : (
        <span
          className={[
            "text-title1 text-core-1 text-center",
            "whitespace-pre-line",
          ].join(" ")}
        >
          {hasValue ? value : placeholder}
        </span>)}
    </button>
  );
}
