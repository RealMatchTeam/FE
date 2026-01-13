import type { SelectButtonProps } from "../types";

function SelectButton({ options, value, onChange }: SelectButtonProps) {
  return (
    <div className="flex gap-3">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`flex-1 h-14 rounded-2xl text-title2 font-semibold transition-all ${
            value === option
              ? "bg-core-1 text-white"
              : "bg-white border border-text-gray4 text-text-black hover:bg-bluegray-1"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default SelectButton;
