import SelectChip from "./SelectChip";

type SectionKey = "style" | "function" | "skinType" | "skinTone" | "makeupStyle";

interface MatchingSection {
  key: SectionKey;
  title: string;
  items: readonly string[];
}

type SelectedState = Record<SectionKey, string[]>;

interface MatchingTestContentProps {
  progressText: string;
  maxText: string;

  sections: readonly MatchingSection[];
  selected: SelectedState;

  maxPerSection: number;

  isSelected: (section: SectionKey, label: string) => boolean;
  onToggle: (section: SectionKey, label: string) => void;

  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
}

export default function MatchingTestContent({
  progressText,
  maxText,
  sections,
  selected,
  maxPerSection,
  isSelected,
  onToggle,
  canGoNext,
  onBack,
  onNext,
}: MatchingTestContentProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ✅ 진행바 위 여백 38px */}
      <div className="pt-[38px]">
        <div className="h-1 w-full bg-bluegray-1">
          <div className="h-1 w-[133px] bg-core-1 rounded-full" />
        </div>
      </div>

      {/* ✅ 버튼 sticky라서 본문 하단 여백 확보 */}
      <main className="flex-1 px-6 pt-6 pb-24">
        {/* 상단 헤더 */}
        <div className="relative flex items-center justify-center mb-6">
          <button
            type="button"
            onClick={onBack}
            className="absolute left-0 text-text-gray3 text-[24px] leading-none active:opacity-90"
            aria-label="뒤로가기"
          >
            ‹
          </button>

          <span className="text-body1 text-text-gray3">{progressText}</span>
        </div>

        {/* 타이틀 */}
        <h1 className="text-[24px] leading-[32px] font-extrabold text-text-black">
          관심 있는 <span className="text-core-1">뷰티 특성</span>을
          <br />
          <span className="text-core-1">모두</span> 선택해주세요
        </h1>
        <p className="text-body1 text-text-gray3 mt-2">{maxText}</p>

        {/* ✅ 섹션들 */}
        {sections.map((section) => {
          const sectionSelectedCount = selected[section.key].length;
          const sectionLimitReached = sectionSelectedCount >= maxPerSection;

          return (
            <section key={section.key} className="mt-8">
              <h2 className="text-title1 text-text-black mb-3">
                {section.title}
              </h2>

              <div className="flex flex-wrap gap-3">
                {section.items.map((label) => {
                  const checked = isSelected(section.key, label);

                  // ✅ 섹션에서 2개 꽉 찼으면 “추가 선택”만 막고,
                  // 이미 선택된 칩은 해제 가능해야 함
                  const disabled = !checked && sectionLimitReached;

                  return (
                    <SelectChip
                      key={label}
                      label={label}
                      isSelected={checked}
                      disabled={disabled}
                      onToggle={() => onToggle(section.key, label)}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* ✅ 하단 고정(컨테이너 폭 안에서): sticky */}
      <div className="sticky bottom-0 bg-white px-6 pt-3 pb-6">
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className={[
            "w-full h-[52px] rounded-[12px]",
            "text-title1",
            canGoNext ? "bg-core-1 text-white" : "bg-core-2 text-text-gray3",
            "active:opacity-90",
          ].join(" ")}
        >
          다음
        </button>
      </div>
    </div>
  );
}
