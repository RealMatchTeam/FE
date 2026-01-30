import { cn } from "../../lib/utils";

interface FilterChipProps {
    label: string;
    selected?: boolean;
    onClick?: () => void;
}

export default function FilterChip({ label, selected = false, onClick }: FilterChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "p-2 rounded-full text-[14px] transition-colors cursor-pointer whitespace-nowrap",
                selected
                    ? "bg-core-70 text-core-1 border border-core-3 shadow-[0_1px_3px_0_#D4D4D9]"
                    : "bg-white text-text-gray3 border border-gray2"
            )}
        >
            {label}
        </button>
    );
}
