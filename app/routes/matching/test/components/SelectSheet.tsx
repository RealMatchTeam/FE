interface SelectSheetProps<T extends readonly string[]> {
  options: T;
  value: string;
  onSelect: (v: T[number]) => void;
}

export default function SelectSheet<T extends readonly string[]>({
  options,
  value,
  onSelect,
}: SelectSheetProps<T>) {
  return (
    <div className="bg-white">
      <div className="space-y-1">
        {options.map((opt) => {
          const selected = opt === value;

          return (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(opt)}
              className={[
                "w-full",
                "h-[48px]",
                "rounded-2xl",
                "text-center",
                "text-title3",
                "transition-colors",
                "active:opacity-90",
                selected
                  ? "bg-core-2 text-core-1 font-semibold"
                  : "bg-white text-text-gray1",
              ].join(" ")}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
