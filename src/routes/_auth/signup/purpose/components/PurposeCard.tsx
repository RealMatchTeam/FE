import type { ReactNode } from "react";

interface PurposeCardProps {
  label: string;
  icon: ReactNode;
  selected: boolean;
  onClick: () => void;
}

export function PurposeCard({ label, icon, selected, onClick }: PurposeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col w-[164px] h-[100px] px-4 py-4 justify-center items-center gap-2 rounded-xl border transition-colors ${
        selected
          ? "border-core-1 bg-core-70"
          : "border-core-2 bg-bg-w-60"
      }`}
    >
      <div className="text-core-1">{icon}</div>
      <span className="text-title3 text-core-1 whitespace-pre-line text-center">
        {label}
      </span>
    </button>
  );
}
