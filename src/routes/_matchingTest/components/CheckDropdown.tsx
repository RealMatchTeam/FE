interface CheckDropdownProps<T extends readonly string[]> {
  options: T;
  values: string[]; // ✅ 다중 선택
  onToggle: (v: T[number]) => void; // ✅ 토글
  onDone: () => void;
}

export default function CheckDropdown<T extends readonly string[]>({
  options,
  values,
  onToggle,
  onDone,
}: CheckDropdownProps<T>) {
  return (
    <div className="mx-auto w-full max-w-[260px] rounded-2xl border border-text-gray4 bg-white px-4 py-4">
      {/* 옵션 */}
      <div className="flex flex-col items-center gap-4">
        {options.map((opt) => {
          const checked = values.includes(opt);

          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className="flex items-center gap-3 active:opacity-90"
            >
              {/* 체크박스 */}
              <span
                className={[
                  "grid h-5 w-5 place-items-center rounded-[5px] border",
                  checked ? "border-core-1 bg-core-1" : "border-text-gray4 bg-white",
                ].join(" ")}
                aria-hidden="true"
              >
                {checked ? (
                  <span className="text-[12px] leading-none text-white">✓</span>
                ) : null}
              </span>

              <span className={checked ? "font-semibold text-core-1" : "text-core-1/80"}>
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {/* 입력 완료 */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={onDone}
          className="text-[12px] font-medium text-core-1/60 active:opacity-90"
        >
          입력 완료
        </button>
      </div>
    </div>
  );
}
