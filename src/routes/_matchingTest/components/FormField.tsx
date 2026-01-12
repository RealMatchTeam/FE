interface FormFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onClick: () => void;
}

export default function FormField({ label, value, placeholder, onClick }: FormFieldProps) {
  const hasValue = value.trim().length > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full",
        "rounded-2xl",
        "border border-text-gray4",
        "bg-white",
        "px-4 py-3",
      ].join(" ")}
    >
      <div className="flex justify-center">
        <span className="inline-flex items-center justify-center text-[12px] leading-[16px] font-medium text-text-gray3">
          {label}
        </span>
      </div>

      <div className="mt-1 flex justify-center">
        <span className="text-title1 text-core-1">
          {hasValue ? value : placeholder}
        </span>
      </div>
    </button>
  );
}
