import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MatchingTestStep2Content from "./step2-content";
import {
  useMatchingTestStore,
  type Step2SectionKey,
} from "../../../../stores/matching-test";
import { useFashionTags } from "../_shared/tags/tags.query";
import type { TagItem } from "../_shared/tags/tags.types";

const SECTIONS: Array<{ key: Step2SectionKey; title: string }> = [
  { key: "fashionStyle", title: "관심 스타일" },
  { key: "interestItem", title: "관심 아이템/분야" },
  { key: "brandType", title: "관심 브랜드 종류" }, // ✅ 표시 타이틀
];

type ItemsBySection = Record<Step2SectionKey, TagItem[]>;

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

export default function MatchingTestStep2Page() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useFashionTags();

  const selected = useMatchingTestStore((s) => s.step2Selected);
  const toggle = useMatchingTestStore((s) => s.toggleStep2);

  const fashionBody = useMatchingTestStore((s) => s.fashionBody);
  const setFashionBody = useMatchingTestStore((s) => s.setFashionBody);

  const itemsBySection = useMemo((): ItemsBySection => {
    const categories = data?.categories ?? {};

    return {
      fashionStyle: pickCategory(categories, [
        "관심 스타일",
        "패션 스타일",
        "스타일",
      ]),
      interestItem: pickCategory(categories, [
        "관심 아이템/분야",
        "관심 아이템",
        "아이템/분야",
        "아이템",
        "관심 분야",
        "분야",
      ]),
      brandType: pickCategory(categories, [
        "관심 브랜드 종류",
        "선호 브랜드 종류", // ✅ API 응답 키 대응
        "브랜드 종류",
        "브랜드 타입",
        "브랜드",
      ]),
    };
  }, [data]);

  const computedSections = useMemo(() => {
    return SECTIONS.filter((s) => (itemsBySection[s.key]?.length ?? 0) > 0);
  }, [itemsBySection]);

  const isSelected = (section: Step2SectionKey, id: number) =>
    selected[section].includes(id);

  const canGoNext = useMemo(() => {
    const chipsOk = computedSections.every((s) => selected[s.key].length >= 1);

    const bodyOk =
      fashionBody.heightTag !== null &&
      fashionBody.weightTypeTag !== null &&
      fashionBody.topSizeTag !== null &&
      fashionBody.bottomSizeTag !== null;

    return chipsOk && bodyOk;
  }, [computedSections, selected, fashionBody]);

  const errorText = error ? error.message : null;

  return (
    <MatchingTestStep2Content
      isLoading={isLoading}
      errorText={errorText}
      sections={computedSections}
      itemsBySection={itemsBySection}
      selected={selected}
      isSelected={isSelected}
      onToggle={(section, id) => toggle(section, id)}
      fashionBody={fashionBody}
      onSetFashionBody={setFashionBody}
      canGoNext={canGoNext}
      onBack={() => navigate("/matching/test/step1")}
      onNext={() => navigate("/matching/test/step3")}
    />
  );
}
