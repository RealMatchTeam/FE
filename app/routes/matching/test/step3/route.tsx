import { useNavigate } from "react-router";
import { useMemo } from "react";
import MatchingTestStep3Content from "./step3-content";
import { useMatchingTestStore, type Step3ChipKey, type Step3SelectKey } from "../../../../stores/matching-test";

export default function MatchingTestStep3Page() {
  const navigate = useNavigate();
  const MAX_CHIP = 5;
  const MAX_MULTI = 5;

  const snsUrl = useMatchingTestStore((s) => s.snsUrl);
  const setSnsUrl = useMatchingTestStore((s) => s.setSnsUrl);

  const isValidInstagramUrl = useMatchingTestStore((s) => s.isValidInstagramUrl());

  const step3Selected = useMatchingTestStore((s) => s.step3Selected);
  const toggleSelect = useMatchingTestStore((s) => s.toggleStep3Select);

  const step3Chips = useMatchingTestStore((s) => s.step3Chips);
  const toggleChip = useMatchingTestStore((s) => s.toggleStep3Chip);

  const onToggleSelect = (key: Step3SelectKey, label: string) => {
    const max = key === "videoLength" || key === "views" ? 1 : MAX_MULTI;
    toggleSelect(key, label, max);
  };

  const onToggleChip = (key: Step3ChipKey, label: string) => toggleChip(key, label, MAX_CHIP);

  const canGoNext = useMemo(() => {
    const snsOk = snsUrl.trim().length > 0;
    const genderOk = step3Selected.gender.length > 0;
    const ageOk = step3Selected.ageGroup.length > 0;
    const lenOk = step3Selected.videoLength.length > 0;
    const viewsOk = step3Selected.views.length > 0;

    const chipsOk =
      step3Chips.contentFormat.length > 0 &&
      step3Chips.contentType.length > 0 &&
      step3Chips.contentTone.length > 0 &&
      step3Chips.contentHardness.length > 0 &&
      step3Chips.editingRange.length > 0;

    return snsOk && genderOk && ageOk && lenOk && viewsOk && chipsOk;
  }, [snsUrl, step3Selected, step3Chips]);

  return (
    <MatchingTestStep3Content
      snsUrl={snsUrl}
      onSnsUrlChange={setSnsUrl}
      isValidInstagramUrl={isValidInstagramUrl}
      step3Selected={step3Selected}
      onToggleSelect={onToggleSelect}
      step3Chips={step3Chips}
      onToggleChip={onToggleChip}
      canGoNext={canGoNext}
      onBack={() => navigate("/matching/test/step2")}
      onNext={() => navigate("/matching/test/result")}
    />
  );
}
