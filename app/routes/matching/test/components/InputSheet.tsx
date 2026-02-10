interface InputSheetProps {
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  doneDisabled: boolean;
  onDone: () => void;

  helperText?: string;
  errorText?: string;
}

export default function InputSheet({
  value,
  placeholder,
  onChange,
  doneDisabled,
  onDone,
  helperText,
  errorText,
}: InputSheetProps) {
  const showError = Boolean(errorText) && value.trim().length > 0;

  return (
    <div className="px-2 pb-6">
      <div
        className={[
          "flex items-center",
          "h-[52px]",
          "rounded-2xl",
          "border",
          "bg-white",
          "px-4"
          ,
          showError ? "border-error" : "border-core-3",
        ].join(" ")}
      >
        <input
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode="numeric"
          className={[
            "flex-1",
            "bg-transparent",
            "text-title3",
            "text-text-gray1",
            "outline-none",
            "placeholder:text-text-gray4",
          ].join(" ")}
        />

        {!showError && helperText ? (
          <span className="ml-3 text-callout1 text-text-gray2 whitespace-nowrap">
            {helperText}
          </span>
        ) : null}
      </div>

<div className="min-h-[18px] mt-2">
  {showError && (
    <p className="text-callout2 text-error">{errorText}</p>
  )}
</div>


      <button
        type="button"
        disabled={doneDisabled}
        onClick={onDone}
        className={[
          "mt-8 w-full h-[52px] rounded-2xl text-title7 transition-opacity",
          doneDisabled
            ? "bg-bluegray-2 text-text-gray3"
            : "bg-core-1 text-white active:opacity-90",
        ].join(" ")}
      >
        입력 완료
      </button>
    </div>
  );
}
