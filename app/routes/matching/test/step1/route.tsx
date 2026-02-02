import { useNavigate } from "react-router";
import { useMemo } from "react";
import MatchingTestContent from "./step1-content";

import {
  useMatchingTestStore,
  type SectionKey,
  type TagId,
} from "../../../../stores/matching-test";
import { useBeautyTags } from "../_shared/tags/tags.query";
import type { TagItem } from "../_shared/tags/tags.types";

// ⚠️ 중요: 아래 key는 swagger에 additionalProp로 나와서 실제 키를 백엔드에게 확인해야 함.
// 실제 예: "interests", "functions", "skinTypes", "skinTones", "makeupStyles" 등
const BEAUTY_CATEGORY_KEY: Record<SectionKey, string> = {
  style: "style",
  function: "function",
  skinType: "skinType",
  skinTone: "skinTone",
  makeupStyle: "makeupStyle",
};

const SECTIONS: Array<{ key: SectionKey; title: string; max: number }> = [
  { key: "style", title: "관심 스타일", max: 5 },
  { key: "function", title: "관심 기능", max: 5 },
  { key: "skinType", title: "피부 타입", max: 1 },
  { key: "skinTone", title: "피부 밝기", max: 1 },
  { key: "makeupStyle", title: "메이크업 스타일", max: 1 },
];

export default function MatchingTestStep1Page() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useBeautyTags();

  const selected = useMatchingTestStore((s) => s.selected);
  const toggleStep1 = useMatchingTestStore((s) => s.toggleStep1);
  const setSingleStep1 = useMatchingTestStore((s) => s.setSingleStep1);

  const sectionItems = useMemo(() => {
    const categories = data?.categories ?? {};
    const out: Record<SectionKey, TagItem[]> = {
      style: categories[BEAUTY_CATEGORY_KEY.style] ?? [],
      function: categories[BEAUTY_CATEGORY_KEY.function] ?? [],
      skinType: categories[BEAUTY_CATEGORY_KEY.skinType] ?? [],
      skinTone: categories[BEAUTY_CATEGORY_KEY.skinTone] ?? [],
      makeupStyle: categories[BEAUTY_CATEGORY_KEY.makeupStyle] ?? [],
    };
    return out;
  }, [data]);

  const isSelected = (section: SectionKey, id: TagId) =>
    selected[section].includes(id);

  const canGoNext = useMemo(
    () => SECTIONS.every((s) => selected[s.key].length >= 1),
    [selected],
  );

  return (
    <MatchingTestContent
      isLoading={isLoading}
      errorText={error instanceof Error ? error.message : null}
      sections={SECTIONS}
      itemsBySection={sectionItems}
      selected={selected}
      isSelected={isSelected}
      onToggle={(section, id, max) => {
        if (max === 1) setSingleStep1(section, id);
        else toggleStep1(section, id, max);
      }}
      canGoNext={canGoNext}
      onBack={() => navigate("/")}
      onNext={() => navigate("/matching/test/step2")}
    />
  );
}
