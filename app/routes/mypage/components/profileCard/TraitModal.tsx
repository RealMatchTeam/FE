type Trait = {
  badge: string;
  icon: (className?: string) => React.ReactNode;
  topSummary: { label: string; value: string }[];
  sections: { title: string; items: string[] }[];
};

export default function TraitModal({
  trait,
  onClose,
}: {
  trait: Trait;
  onClose: () => void;
}) {
  const cols = trait.topSummary.length; // 3개 or 4개

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={[
          "w-full max-w-[336px]",
          "bg-[#F3F4F8] rounded-[13px]",
          "relative",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 text-[#9B9BA1] active:opacity-70"
          aria-label="close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* body */}

        <div className="flex flex-col px-4 pt-5 pb-[18px] gap-[10px]">
          <div className="">
            <div className=" flex items-center justify-center gap-2">
              <div className="flex items-center justify-center">
                <div className="">{trait.icon("w-[46px] h-[47px]")}</div>
              </div>
              <div className="text-[16px] leading-[20px] font-SemiBold text-[#4A4DFF]">
                {trait.badge}
              </div>
            </div>
          </div>

          {/* top summary bar */}
          <div className="bg-white rounded-[13px] px-[6px] py-3">
            <div
              className={[
                "grid",
                cols === 3 ? "grid-cols-3" : "grid-cols-4",
                "items-stretch",
              ].join(" ")}
            >
              {trait.topSummary.map((item, i) => (
                <div
                  key={i}
                  className={[
                    "text-center px-[1px]",
                    i === 0 ? "" : "border-l border-[#E8E8FB]",
                  ].join(" ")}
                >
                  <div className="text-[10px] leading-[12px] text-[#6666E5] font-SemiBold">
                    {item.label}
                  </div>
                  <div className="mt-1 text-[12px] leading-[16px] text-[#5B5D6B] font-Pretendard">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* sections */}
          <div className="space-y-[10px]">
            {trait.sections.map((section, i) => (
              <div key={i}>
                <div className="text-[12px] leading-[16px] font-Medium text-[#6666E5]">
                  {section.title}
                </div>
                <div className="text-[12px] leading-[16px] font-Medium text-[#404252]">
                  {section.items.join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
