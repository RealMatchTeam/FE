import MatchingTestTopBar from "../components/MatchingTestHeader";
import SelectChip from "../components/SelectChip";
import Button from "../../../../components/common/Button";
import LoadingView from "../../../../components/common/LoadingView";
import type { SectionKey } from "../../../../stores/matching-test";
import type { TagItem } from "../../../../types/campaign";

type Props = {
  isLoading: boolean;
  errorText: string | null;

  sections: Array<{ key: SectionKey; title: string }>;
  itemsBySection: Record<SectionKey, TagItem[]>;

  isSelected: (section: SectionKey, id: number) => boolean;
  onToggle: (section: SectionKey, id: number) => void;

  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
};

export default function MatchingTestContent({
  isLoading,
  errorText,
  sections,
  itemsBySection,
  isSelected,
  onToggle,
  canGoNext,
  onBack,
  onNext,
}: Props) {
  if (isLoading) {
    if (isLoading) {
      return <LoadingView message="태그 정보를 불러오는 중이에요" />;
    }
  }

  if (errorText) {
    return (
      <div className="min-h-screen bg-white">
        <MatchingTestTopBar step={1} totalSteps={3} onBack={onBack} />
        <div className="px-6 py-10 text-sm text-red-500">{errorText}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <MatchingTestTopBar step={1} totalSteps={3} onBack={onBack} />

      <main className="flex-1 px-6">
        <h1 className="text-[24px] leading-[32px] font-extrabold text-text-black">
          관심 있는 <span className="text-core-1">뷰티 특성</span>을
          <br />
          <span className="text-core-1">모두</span> 선택해주세요
        </h1>

        {sections.map((section) => {
          const items = itemsBySection[section.key] ?? [];

          return (
            <section key={section.key} className="mt-8">
              <h2 className="text-title1 text-text-black mb-3">
                {section.title}
              </h2>

              <div className="flex flex-wrap gap-3">
                {items.map((tag) => {
                  const checked = isSelected(section.key, tag.id);

                  return (
                    <SelectChip
                      key={tag.id}
                      label={tag.name}
                      isSelected={checked}
                      onToggle={() => onToggle(section.key, tag.id)}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      <div className="sticky bottom-0 bg-white px-6 pt-3 pb-6">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onNext}
          disabled={!canGoNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
