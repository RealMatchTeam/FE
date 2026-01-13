import type { SelectCardProps } from "../types";

function SelectCard({ icon, label, selected = false, onClick }: SelectCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full h-[100px] rounded-2xl flex flex-col items-center justify-center gap-2 transition-all active:scale-[0.98] ${
        selected
          ? "bg-core-1 text-white"
          : "bg-core-2 text-core-1 hover:bg-core-3"
      }`}
    >
      <div className="w-10 h-10 flex items-center justify-center">{icon}</div>
      <span className="text-callout2 font-semibold">{label}</span>
    </button>
  );
}

export default SelectCard;
