import { useNavigate } from "react-router";
import { useMemo } from "react";
import MatchingTestStep2Content from "./step2-content";
import { useMatchingTestStore, type Step2SectionKey } from "../../../../stores/matching-test";

export default function MatchingTestStep2Page() {
  const navigate = useNavigate();
  const MAX_PER_SECTION = 5;

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

  const isSelected = (section: Step2SectionKey, label: string) =>
    selected[section].includes(label);

  const canGoNext = useMemo(() => {
    const chipsOk =
      selected.fashionStyle.length >= 1 &&
      selected.interestItem.length >= 1 &&
      selected.brandType.length >= 1;

    const bodyOk = heightCm.trim().length > 0 && bodyShape.trim().length > 0;
    const sizeOk = topSize.trim().length > 0 && bottomSizeIn.trim().length > 0;

    return chipsOk && bodyOk && sizeOk;
  }, [selected, heightCm, bodyShape, topSize, bottomSizeIn]);

  return (
    <MatchingTestStep2Content
      maxText="*최대 5개까지 선택 가능합니다."
      maxPerSection={MAX_PER_SECTION}
      selected={selected}
      isSelected={isSelected}
      onToggle={(section, label) => toggle(section, label, MAX_PER_SECTION)}
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
