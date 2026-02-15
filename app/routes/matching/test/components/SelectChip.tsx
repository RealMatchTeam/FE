interface SelectChipProps {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function SelectChip({
  label,
  isSelected,
  onToggle,
  disabled = false,
}: SelectChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={[
        "flex items-center justify-center",
        "h-[28px] px-2.5 py-1",
        "rounded-[20px]",
        "border",
        "text-body1",
        "transition-colors",
        disabled ? "opacity-50 cursor-not-allowed" : "active:opacity-90",
        isSelected
          ? "border-core-3 bg-core-70 text-core-1"
          : "border-core-2 bg-white text-text-gray2",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
