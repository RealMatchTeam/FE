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
    <div className="overflow-hidden rounded-2xl border border-text-gray4 bg-white">
      {options.map((opt) => {
        const selected = opt === value;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={[
              "w-full px-4 py-3 text-center text-sm",
              selected ? "text-core-1 font-semibold" : "text-text-gray2",
              "active:opacity-90",
            ].join(" ")}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
