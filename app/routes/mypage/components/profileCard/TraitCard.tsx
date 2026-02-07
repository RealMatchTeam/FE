type Trait = {
  id: string;
  badge: string;
  icon: (className?: string) => React.ReactNode;
  previewLines: { label: string; value: string }[];
};

export default function TraitCard({ trait, onClick }: { trait: Trait; onClick: () => void }) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className="w-[136px] h-[216px] rounded-[6px] bg-white drop-shadow-[0_1px_3px_#D4D4D9] px-[8px] py-[10px] flex flex-col items-center gap-[10px] active:scale-[0.99] transition-transform"
    >
      {/* badge */}
      <div className="inline-flex items-center rounded-full h-[20px] bg-[#B7B7F3] px-[6px] py-[2px] text-[12px] font-Medium text-white">
        {trait.badge}
      </div>

      {/* icon area */}
      <div className="w-[72px] h-[74px] flex items-center justify-center overflow-hidden">
        {trait.icon("w-[72px] h-[74px]")}
      </div>

      {/* preview lines */}
      <div className=" space-y-[6px]">
        {trait.previewLines.map((row, i) => (
          <div key={i} className="grid grid-cols-[47px_1fr] items-center gap-x-[4px]">
            <span className="text-left text-[#9B9BA1] text-[10px] leading-[12px] font-SemiBold shrink-0 whitespace-pre-line">{row.label}</span>
            <span className="text-left text-[#5B5D6B] text-[12px] leading-[16px] font-medium truncate">{row.value}</span>
          </div>
        ))}
      </div>
    </button>
  );
}
