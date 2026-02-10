interface CheckDropdownProps<T extends readonly string[]> {
  options: T;
  values: string[];
  onToggle: (v: T[number]) => void;
  onDone: () => void;
}

export default function CheckDropdown<T extends readonly string[]>({
  options,
  values,
  onToggle,
  onDone,
}: CheckDropdownProps<T>) {
  return (
    <div className="bg-white">
      <div className="space-y-1">
        {options.map((opt) => {
          const checked = values.includes(opt);

          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={[
                "w-full",
                "h-[48px]",
                "rounded-2xl",
                "transition-colors",
                "active:opacity-90",
                "flex items-center",
                "px-4",
                checked
                  ? "bg-core-2 text-core-1 font-semibold"
                  : "bg-white text-text-gray1",
              ].join(" ")}
            >
              <span
                className={[
                  "grid place-items-center",
                  "h-4 w-4 rounded-[4px] border",
                  checked
                    ? "border-core-1 bg-core-1"
                    : "border-bluegray-2 bg-white",
                ].join(" ")}
                aria-hidden="true"
              >
                {checked ? (
                  <span className="text-[12px] leading-none text-white">✓</span>
                ) : null}
              </span>

              <span className="flex-1 text-center text-title3">{opt}</span>

              <span className="h-4 w-4" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onDone}
        className={[
          "mt-8 w-full h-[52px] rounded-2xl text-title7 transition-opacity",
          "bg-core-1 text-white active:opacity-90",
        ].join(" ")}
      >
        선택 완료
      </button>
    </div>
  );
}
