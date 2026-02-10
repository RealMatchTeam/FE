import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MatchingTestContent from "./step1-content";
import { useBeautyTags } from "../_shared/tags/tags.query";
import {
  useMatchingTestStore,
  type SectionKey,
} from "../../../../stores/matching-test";
import type { TagItem } from "../_shared/tags/tags.types";

const SECTIONS: Array<{ key: SectionKey; title: string }> = [
  { key: "category", title: "관심 카테고리" },
  { key: "function", title: "관심 기능" },
  { key: "skinType", title: "피부 타입" },
  { key: "skinTone", title: "피부 밝기" },
  { key: "makeupStyle", title: "메이크업 스타일" },
];

type ItemsBySection = Record<SectionKey, TagItem[]>;

const pickCategory = (
  categories: Record<string, TagItem[]>,
  candidates: readonly string[],
): TagItem[] => {
  for (const key of candidates) {
    const v = categories[key];
    if (Array.isArray(v)) return v;
  }

  const normalize = (s: string) => s.replace(/\s+/g, "").trim();
  const keys = Object.keys(categories);

  for (const cand of candidates) {
    const hit = keys.find((k) => normalize(k) === normalize(cand));
    if (hit) {
      const v = categories[hit];
      if (Array.isArray(v)) return v;
    }
  }

  return [];
};

export default function MatchingTestStep1Page() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useBeautyTags();

  const selected = useMatchingTestStore((s) => s.selected);
  const toggleStep1 = useMatchingTestStore((s) => s.toggleStep1);

  const itemsBySection = useMemo((): ItemsBySection => {
    const categories = data?.categories ?? {};

    return {
      category: pickCategory(categories, ["관심 스타일"]),
      function: pickCategory(categories, ["관심 기능"]),
      skinType: pickCategory(categories, ["피부 타입"]),
      skinTone: pickCategory(categories, [
        "피부 밝기",
      ]),
      makeupStyle: pickCategory(categories, [
        "메이크업 스타일",
      ]),
    };
  }, [data]);

  const isSelected = (section: SectionKey, id: number) =>
    selected[section].includes(id);

  const canGoNext = useMemo(
    () => SECTIONS.every((s) => selected[s.key].length >= 1),
    [selected],
  );

  const errorText = error ? error.message : null;

  return (
    <MatchingTestContent
      isLoading={isLoading}
      errorText={errorText}
      sections={SECTIONS}
      itemsBySection={itemsBySection}
      isSelected={isSelected}
      onToggle={(section, id) => toggleStep1(section, id)}
      canGoNext={canGoNext}
      onBack={() => navigate("/")}
      onNext={() => navigate("/matching/test/step2")}
    />
  );
}
