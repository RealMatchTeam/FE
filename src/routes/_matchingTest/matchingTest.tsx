import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import MatchingTestContent from "./matchingTestContent";

export const Route = createFileRoute("/_matchingTest/matchingTest")({
  component: MatchingTestPage,
});

type SectionKey = "style" | "function" | "skinType" | "skinTone" | "makeupStyle";

const SECTIONS: Array<{
  key: SectionKey;
  title: string;
  items: readonly string[];
}> = [
  { key: "style", title: "관심 스타일", items: ["스킨케어", "메이크업", "향수", "바디", "헤어"] },
  { key: "function", title: "관심 기능", items: ["트러블", "수분 / 보습", "진정", "미백", "안티에이징", "각질/모공"] },
  { key: "skinType", title: "피부 타입", items: ["건성", "지성", "복합성", "민감성"] },
  { key: "skinTone", title: "피부 밝기", items: ["17호 이하", "17-21호", "21-23호", "23호 이상"] },
  { key: "makeupStyle", title: "메이크업 스타일", items: ["내추럴", "화려한", "글로우", "매트"] },
] as const;

type SelectedState = Record<SectionKey, string[]>;

const EMPTY_SELECTED: SelectedState = {
  style: [],
  function: [],
  skinType: [],
  skinTone: [],
  makeupStyle: [],
};

function MatchingTestPage() {
  const MAX_PER_SECTION = 2;

  const [selected, setSelected] = useState<SelectedState>(EMPTY_SELECTED);

  const isSelected = (section: SectionKey, label: string) =>
    selected[section].includes(label);

  // ✅ 섹션별 토글: 최대 2개 제한
  const toggle = (section: SectionKey, label: string) => {
    setSelected((prev) => {
      const current = prev[section];
      const already = current.includes(label);

      // 해제
      if (already) {
        return { ...prev, [section]: current.filter((x) => x !== label) };
      }

      // 추가 (섹션별 최대 2개)
      if (current.length >= MAX_PER_SECTION) return prev;

      return { ...prev, [section]: [...current, label] };
    });
  };

  // ✅ “다음” 활성 조건: 모든 섹션에서 1개 이상 선택되어야 함
  const canGoNext = useMemo(() => {
    return SECTIONS.every((s) => selected[s.key].length >= 1);
  }, [selected]);

  return (
    <MatchingTestContent
      progressText="1 / 3"
      maxText="*각 영역에서 1개 이상 선택, 최대 2개까지 선택 가능합니다"
      sections={SECTIONS}
      selected={selected}
      maxPerSection={MAX_PER_SECTION}
      isSelected={isSelected}
      onToggle={toggle}
      canGoNext={canGoNext}
      onBack={() => history.back()}
      onNext={() => {
        console.log("selected:", selected);
      }}
    />
  );
}
