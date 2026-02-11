import { useMemo } from "react";
import MatchingTestTopBar from "../components/MatchingTestHeader";
import SelectChip from "../components/SelectChip";
import Button from "../../../../components/common/Button";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";
import type { SectionKey } from "../../../../stores/matching-test";
import type { TagItem } from "../_shared/tags/tags.types";

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

const SECTION_ORDER: SectionKey[] = [
  "category",
  "function",
  "skinType",
  "skinTone",
  "makeupStyle",
];

const sortTagsById = (items: TagItem[]) =>
  [...items].sort((a, b) => a.id - b.id);

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
  const orderIndex = useMemo(
    () => new Map<SectionKey, number>(SECTION_ORDER.map((k, i) => [k, i])),
    [],
  );

  const sortedSections = useMemo(() => {
    return [...sections].sort((a, b) => {
      const ai = orderIndex.get(a.key) ?? 999;
      const bi = orderIndex.get(b.key) ?? 999;
      return ai - bi;
    });
  }, [sections, orderIndex]);

  const sortedItemsBySection = useMemo(() => {
    const next = {} as Record<SectionKey, TagItem[]>;
    for (const key of SECTION_ORDER) {
      next[key] = sortTagsById(itemsBySection?.[key] ?? []);
    }
    return next;
  }, [itemsBySection]);

  if (isLoading) {
    return (
      <div className="w-full mx-auto h-full bg-white">
        <MatchingTestTopBar step={1} totalSteps={3} onBack={onBack} />
        <LoadingSpinner className="py-10" />
      </div>
    );
  }

  if (errorText) {
    return (
      <div className="w-full mx-auto h-full bg-white">
        <MatchingTestTopBar step={1} totalSteps={3} onBack={onBack} />
        <div className="px-6 py-10 text-sm text-red-500">{errorText}</div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto h-full bg-white flex flex-col">
      <MatchingTestTopBar step={1} totalSteps={3} onBack={onBack} />

      <main className="flex-1 px-6 pb-6">
        <h1 className="text-title leading-8 text-text-black">
          관심 있는 <span className="text-core-1">뷰티 특성</span>을
          <br />
          <span className="text-core-1">모두</span> 선택해주세요
        </h1>

        {sortedSections.map((section) => {
          const items = sortedItemsBySection[section.key] ?? [];

          return (
            <section key={section.key} className="mt-8 bg-white">
              <h2 className="text-title2 text-text-black mb-2">
                {section.title}
              </h2>

              <div className="flex flex-wrap gap-3 bg-white">
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
