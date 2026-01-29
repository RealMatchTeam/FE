import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import MatchingTestContent from "./step1-content";
import { useMatchingTestStore, type SectionKey } from "../../../../../stores/matching-test";

const SECTIONS: Array<{
  key: SectionKey;
  title: string;
  items: readonly string[];
}> = [
  { key: "style", title: "관심 스타일", items: ["스킨케어", "메이크업", "향수", "바디", "헤어"] },
  {
    key: "function",
    title: "관심 기능",
    items: ["트러블", "수분 / 보습", "진정", "미백", "안티에이징", "각질/모공"],
  },
  { key: "skinType", title: "피부 타입", items: ["건성", "지성", "복합성", "민감성"] },
  { key: "skinTone", title: "피부 밝기", items: ["17호 이하", "17-21호", "21-23호", "23호 이상"] },
  { key: "makeupStyle", title: "메이크업 스타일", items: ["내추럴", "화려한", "글로우", "매트"] },
] as const;

export const Route = createFileRoute("/_main/matching/test/step1")({
  component: MatchingTestStep1Page,
});

function MatchingTestStep1Page() {
  const navigate = useNavigate();
  const MAX_PER_SECTION = 5;

  const selected = useMatchingTestStore((s) => s.selected);
  const toggleStore = useMatchingTestStore((s) => s.toggleStep1);

  const isSelected = (section: SectionKey, label: string) =>
    selected[section].includes(label);

  const canGoNext = useMemo(
    () => SECTIONS.every((s) => selected[s.key].length >= 1),
    [selected]
  );

  return (
    <MatchingTestContent
      progressText="1 / 3"
      maxText="*최대 5개까지 선택 가능합니다."
      sections={SECTIONS}
      selected={selected}
      maxPerSection={MAX_PER_SECTION}
      isSelected={isSelected}
      onToggle={(section, label) => toggleStore(section, label, MAX_PER_SECTION)}
      canGoNext={canGoNext}
      onBack={() => navigate({ to: "/" })}
      onNext={() => navigate({ to: "/matching/test/step2" })}
    />
  );
}
