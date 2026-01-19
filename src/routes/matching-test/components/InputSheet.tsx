interface InputSheetProps {
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  doneDisabled: boolean;
  onDone: () => void;
  suffix?: string;

  helperText?: string;
  errorText?: string;
}

export default function InputSheet({
  value,
  placeholder,
  onChange,
  doneDisabled,
  onDone,
  suffix,
  helperText,
  errorText,
}: InputSheetProps) {
  const showError = Boolean(errorText) && value.trim().length > 0;

  return (
    <div>
      <div className="rounded-2xl border border-text-gray4 p-4">
        <input
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={[
            "w-full rounded-xl border px-3 py-3 text-sm outline-none",
            showError ? "border-red-400 focus:border-red-500" : "border-text-gray4 focus:border-core-3",
          ].join(" ")}
        />

        {showError ? (
          <p className="mt-2 text-[12px] leading-[18px] text-red-500">{errorText}</p>
        ) : helperText ? (
          <p className="mt-2 text-[12px] leading-[18px] text-text-gray3">{helperText}</p>
        ) : null}

        {suffix ? <div className="mt-2 text-right text-xs text-text-gray3">{suffix}</div> : null}
      </div>

      <button
        type="button"
        disabled={doneDisabled}
        onClick={onDone}
        className={[
          "mt-4 w-full rounded-xl py-3 text-sm font-semibold",
          doneDisabled ? "bg-bluegray-2 text-text-gray3" : "bg-core-1 text-white active:opacity-90",
        ].join(" ")}
      >
        완료
      </button>
    </div>
  );
}
