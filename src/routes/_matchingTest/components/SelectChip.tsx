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
        "inline-flex items-center justify-center",
        "h-[34px] px-4",
        "rounded-full",
        "border",
        "text-body1",
        "transition-colors",
        disabled ? "opacity-50 cursor-not-allowed" : "active:opacity-90",
        isSelected
          ? "border-core-3 bg-[rgba(183,183,243,0.70)] text-core-1"
          : "border-text-gray4 bg-white text-text-gray2",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
