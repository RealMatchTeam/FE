import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MatchingTestStep3Content from "./step3-content";

// ✅ 스토어/유틸/타입/훅 경로는 프로젝트에 맞게 조정
import { useMatchingTestStore } from "../../../../stores/matching-test";
import { useContentTags } from "../_shared/tags/tags.query";
import { buildMatchPayload } from "../_shared/builders/build-match-payload";
import { postMatches } from "../_shared/api/matches.api";

export default function MatchingTestStep3Page() {
  const navigate = useNavigate();

  // store
  const snsUrl = useMatchingTestStore((s) => s.snsUrl);
  const setSnsUrl = useMatchingTestStore((s) => s.setSnsUrl);

  const step3Selected = useMatchingTestStore((s) => s.step3Selected);
  const onToggleSelect = useMatchingTestStore((s) => s.onToggleSelect);

  const step3Chips = useMatchingTestStore((s) => s.step3Chips);
  const onToggleChip = useMatchingTestStore((s) => s.onToggleChip);

  const canGoNext = useMatchingTestStore((s) => s.canGoNextStep3);

  // tags query
  const {
    data: contentTags,
    isLoading: tagsLoading,
    error: tagsError,
  } = useContentTags();

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isValidInstagramUrl = /^https?:\/\/(www\.)?instagram\.com\/.+/i.test(snsUrl.trim());

  const handleSubmit = async () => {
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
      setSubmitError(e instanceof Error ? e.message : "제출 중 오류가 발생했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MatchingTestStep3Content
      // ✅ tags
      contentTags={contentTags ?? null}
      tagsLoading={tagsLoading}
      tagsError={tagsError}
      snsUrl={snsUrl}
      onSnsUrlChange={setSnsUrl}
      isValidInstagramUrl={isValidInstagramUrl}
      step3Selected={step3Selected}
      onToggleSelect={onToggleSelect}
      step3Chips={step3Chips}
      onToggleChip={onToggleChip}
      canGoNext={canGoNext}
      submitting={submitting}
      submitError={submitError}
      onBack={() => navigate("/matching/test/step2")}
      onNext={handleSubmit}
    />
  );
}
