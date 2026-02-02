import { useNavigate } from "react-router";
import { useMemo } from "react";
import MatchingTestStep2Content from "./step2-content";

import {
  useMatchingTestStore,
  type Step2SectionKey,
  type TagId,
} from "../../../../stores/matching-test";
import { useFashionTags } from "../_shared/tags/tags.query";
import type { TagItem } from "../_shared/tags/tags.types";

// ⚠️ 여기도 실제 key를 백엔드에게 확인해야 함 (swagger는 additionalProp)
// 예: "styles", "items", "preferredBrands" 등
const FASHION_CATEGORY_KEY: Record<Step2SectionKey, string> = {
  fashionStyle: "fashionStyle",
  interestItem: "interestItem",
  brandType: "brandType",
};

const SECTIONS: Array<{ key: Step2SectionKey; title: string; max: number }> = [
  { key: "fashionStyle", title: "관심 스타일", max: 5 },
  { key: "interestItem", title: "관심 아이템/분야", max: 5 },
  { key: "brandType", title: "관심 브랜드 종류", max: 5 },
];

export default function MatchingTestStep2Page() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useFashionTags();

  const selected = useMatchingTestStore((s) => s.step2Selected);
  const toggle = useMatchingTestStore((s) => s.toggleStep2);

  const heightCm = useMatchingTestStore((s) => s.heightCm);
  const bodyShape = useMatchingTestStore((s) => s.bodyShape);
  const topSize = useMatchingTestStore((s) => s.topSize);
  const bottomSizeIn = useMatchingTestStore((s) => s.bottomSizeIn);

  const setHeightCm = useMatchingTestStore((s) => s.setHeightCm);
  const setBodyShape = useMatchingTestStore((s) => s.setBodyShape);
  const setTopSize = useMatchingTestStore((s) => s.setTopSize);
  const setBottomSizeIn = useMatchingTestStore((s) => s.setBottomSizeIn);

  const itemsBySection = useMemo(() => {
    const categories = data?.categories ?? {};
    const out: Record<Step2SectionKey, TagItem[]> = {
      fashionStyle: categories[FASHION_CATEGORY_KEY.fashionStyle] ?? [],
      interestItem: categories[FASHION_CATEGORY_KEY.interestItem] ?? [],
      brandType: categories[FASHION_CATEGORY_KEY.brandType] ?? [],
    };
    return out;
  }, [data]);

  const isSelected = (section: Step2SectionKey, id: TagId) =>
    selected[section].includes(id);

  const canGoNext = useMemo(() => {
    const chipsOk = SECTIONS.every((s) => selected[s.key].length >= 1);
    const bodyOk = heightCm.trim().length > 0 && bodyShape.trim().length > 0;
    const sizeOk = topSize.trim().length > 0 && bottomSizeIn.trim().length > 0;
    return chipsOk && bodyOk && sizeOk;
  }, [selected, heightCm, bodyShape, topSize, bottomSizeIn]);

  return (
    <MatchingTestStep2Content
      isLoading={isLoading}
      errorText={error instanceof Error ? error.message : null}
      sections={SECTIONS}
      itemsBySection={itemsBySection}
      selected={selected}
      isSelected={isSelected}
      onToggle={(section, id, max) => toggle(section, id, max)}
      heightCm={heightCm}
      bodyShape={bodyShape}
      topSize={topSize}
      bottomSizeIn={bottomSizeIn}
      onHeightChange={setHeightCm}
      onBodyShapeChange={setBodyShape}
      onTopSizeChange={setTopSize}
      onBottomSizeChange={setBottomSizeIn}
      canGoNext={canGoNext}
      onBack={() => navigate("/matching/test/step1")}
      onNext={() => navigate("/matching/test/step3")}
    />
  );
}
