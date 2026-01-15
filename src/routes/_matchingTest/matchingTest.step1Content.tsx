import SelectChip from "./components/SelectChip";
import MatchingTestTopBar from "./components/MatchingTestHeader";

type SectionKey = "style" | "function" | "skinType" | "skinTone" | "makeupStyle";

interface MatchingSection {
  key: SectionKey;
  title: string;
  items: readonly string[];
}

type SelectedState = Record<SectionKey, string[]>;

interface MatchingTestContentProps {
  // 기존 props 유지(부모에서 내려주고 있으면 안 깨지게)
  progressText: string; // 이제 TopBar가 step/total로 직접 보여주므로 사실상 불필요하지만 유지
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
  // progressText는 더 이상 쓰지 않지만(부모 변경 전까지) props는 유지 가능
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
      {/* ✅ 공용 상단 (1/3) */}
      <MatchingTestTopBar step={1} totalSteps={3} onBack={onBack} />

      {/* ✅ 본문 */}
      <main className="flex-1 px-6">
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

      {/* ✅ 하단 고정 */}
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
