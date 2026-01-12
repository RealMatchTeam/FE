interface CheckDropdownProps<T extends readonly string[]> {
  title: string;
  options: T;
  value: string; // ✅ 단일 선택
  onChange: (v: T[number]) => void;
  onDone: () => void;
}

export default function CheckDropdown<T extends readonly string[]>({
  title,
  options,
  value,
  onChange,
  onDone,
}: CheckDropdownProps<T>) {
  return (
    <div className="w-[375px] bg-white border border-text-gray4 rounded-2xl pt-5 pb-6">
      <div className="flex justify-center">
        <span className="inline-flex items-center justify-center w-[55px] h-[16px] text-[12px] leading-[16px] font-medium text-text-gray3">
          {title}
        </span>
      </div>

      <div className="mt-4 border-t border-bluegray-2" />

      <div className="flex flex-col items-center gap-6 py-6">
        {options.map((opt) => {
          const checked = value === opt;

          return (
            <button key={opt} type="button" onClick={() => onChange(opt)} className="flex items-center gap-4">
              <span
                className={[
                  "flex items-center justify-center w-8 h-8 rounded-lg",
                  checked ? "bg-core-1" : "bg-white border border-text-gray4",
                ].join(" ")}
                aria-hidden="true"
              >
                {checked ? <span className="text-white text-[18px] leading-none">✓</span> : null}
              </span>

              <span className="text-title1 text-core-1">{opt}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onDone}
        className="w-full flex justify-center text-[12px] leading-[18px] font-light text-core-3 active:opacity-90"
      >
        입력 완료
      </button>
    </div>
  );
}
