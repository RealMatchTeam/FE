// app/routes/home/matching/test/step3/route.tsx

import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import MatchingTestStep3Content from "./step3-content";

import {
  useMatchingTestStore,
  type Step3ChipKey,
  type Step3SelectKey,
} from "../../../../stores/matching-test";

import { postMatches } from "../_shared/api/matches.api";
import { buildMatchPayload } from "../_shared/builders/build-match-payload";

import { useContentTags } from "../_shared/tags/tags.query";

export default function MatchingTestStep3Page() {
  const navigate = useNavigate();

  const {
    data: contentTagsRes,
    isLoading: tagsLoading,
    isError: tagsIsError,
    error: tagsErrorObj,
  } = useContentTags();

  const snsUrl = useMatchingTestStore((s) => s.snsUrl);
  const setSnsUrl = useMatchingTestStore((s) => s.setSnsUrl);
  const isValidInstagramUrl = useMatchingTestStore((s) =>
    s.isValidInstagramUrl(),
  );

  const step3Selected = useMatchingTestStore((s) => s.step3Selected);
  const toggleSelect = useMatchingTestStore((s) => s.toggleStep3Select);

  const step3Chips = useMatchingTestStore((s) => s.step3Chips);
  const toggleChip = useMatchingTestStore((s) => s.toggleStep3Chip);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // "다음" 가능 조건
  const canGoNext = useMemo(() => {
    const snsOk = snsUrl.trim().length > 0;
    const genderOk = step3Selected.gender.length > 0;
    const ageOk = step3Selected.ageGroup.length > 0;
    const lenOk = step3Selected.videoLength.length > 0;
    const viewsOk = step3Selected.views.length > 0;

    const chipsOk =
      step3Chips.contentType.length > 0 &&
      step3Chips.contentTone.length > 0 &&
      step3Chips.contentHardness.length > 0 &&
      step3Chips.editingRange.length > 0;

    return snsOk && genderOk && ageOk && lenOk && viewsOk && chipsOk;
  }, [snsUrl, step3Selected, step3Chips]);

  // id 기반 toggle (max=5)
  const onToggleSelect = (key: Step3SelectKey, id: number) => {
    toggleSelect(key, id, 5);
  };

  const onToggleChip = (key: Step3ChipKey, id: number) => {
    toggleChip(key, id, 5);
  };

  // 태그 결과만 step3-content에 내려줌
  const contentTags = contentTagsRes ?? null;

  const tagsError = tagsIsError
    ? tagsErrorObj instanceof Error
      ? tagsErrorObj.message
      : "콘텐츠 태그를 불러오지 못했어요."
    : null;

  // submit handler
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = buildMatchPayload();
      const res = await postMatches(payload);

      if (!res.isSuccess) {
        setSubmitError(res.message);
        return;
      }

      navigate("/matching/test/result");
    } catch (e) {
      setSubmitError(
        e instanceof Error ? e.message : "제출 중 오류가 발생했어요.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MatchingTestStep3Content
      // ✅ tags
      tagsLoading={tagsLoading}
      tagsError={tagsError}
      contentTags={contentTags}
      // ✅ 입력/선택
      snsUrl={snsUrl}
      onSnsUrlChange={setSnsUrl}
      isValidInstagramUrl={isValidInstagramUrl}
      step3Selected={step3Selected}
      onToggleSelect={onToggleSelect}
      step3Chips={step3Chips}
      onToggleChip={onToggleChip}
      // ✅ 제출
      canGoNext={canGoNext}
      submitting={submitting}
      submitError={submitError}
      onBack={() => navigate("/matching/test/step2")}
      onNext={handleSubmit}
    />
  );
}
