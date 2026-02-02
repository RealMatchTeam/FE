import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import MatchingTestStep3Content from "./step3-content";

import {
  useMatchingTestStore,
  type Step3ChipKey,
  type Step3SelectKey,
} from "../../../../stores/matching-test";

import { useContentTags } from "../_shared/tags/tags.query";
import { postMatches } from "../_shared/api/matches.api";
import { buildMatchPayload } from "../_shared/builders/build-match-payload";

export default function MatchingTestStep3Page() {
  const navigate = useNavigate();

  const snsUrl = useMatchingTestStore((s) => s.snsUrl);
  const setSnsUrl = useMatchingTestStore((s) => s.setSnsUrl);

  const step3Selected = useMatchingTestStore((s) => s.step3Selected);
  const toggleStep3Select = useMatchingTestStore((s) => s.toggleStep3Select);
  const setSingleStep3Select = useMatchingTestStore(
    (s) => s.setSingleStep3Select,
  );

  const step3Chips = useMatchingTestStore((s) => s.step3Chips);
  const toggleStep3Chip = useMatchingTestStore((s) => s.toggleStep3Chip);

  const { data, isLoading, error } = useContentTags();
  const tagsError = error ? error.message : null;

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isValidInstagramUrl = useMemo(
    () => /^https?:\/\/(www\.)?instagram\.com\/.+/i.test(snsUrl.trim()),
    [snsUrl],
  );

  const canGoNext = useMemo(() => {
    const snsOk = isValidInstagramUrl;

    const genderOk = step3Selected.gender.length >= 1;
    const ageOk = step3Selected.ageGroup.length >= 1;
    const lenOk = step3Selected.videoLength.length >= 1;
    const viewsOk = step3Selected.views.length >= 1;

    const typeOk = step3Chips.contentType.length >= 1;
    const toneOk = step3Chips.contentTone.length >= 1;
    const invOk = step3Chips.contentHardness.length >= 1;
    const rangeOk = step3Chips.editingRange.length >= 1;

    return (
      snsOk &&
      genderOk &&
      ageOk &&
      lenOk &&
      viewsOk &&
      typeOk &&
      toneOk &&
      invOk &&
      rangeOk
    );
  }, [isValidInstagramUrl, step3Selected, step3Chips]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = buildMatchPayload();
      console.log("[matches payload]", payload);

      const res = await postMatches(payload);
      console.log("[matches response]", res);

      navigate("/matching/test/result", { replace: true });
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.log("[matches error status]", e.response?.status);
        console.log("[matches error body]", e.response?.data);
      }
      throw e;
    }
  };

  return (
    <MatchingTestStep3Content
      contentTags={data ?? null}
      tagsLoading={isLoading}
      tagsError={tagsError}
      snsUrl={snsUrl}
      onSnsUrlChange={setSnsUrl}
      isValidInstagramUrl={isValidInstagramUrl}
      step3Selected={step3Selected}
      onToggleSelect={(key: Step3SelectKey, id: number) =>
        toggleStep3Select(key, id)
      }
      onSelectSingle={(key: Step3SelectKey, id: number) =>
        setSingleStep3Select(key, id)
      }
      step3Chips={step3Chips}
      onToggleChip={(key: Step3ChipKey, id: number) => toggleStep3Chip(key, id)}
      canGoNext={canGoNext}
      submitting={submitting}
      submitError={submitError}
      onBack={() => navigate("/matching/test/step2")}
      onNext={handleSubmit}
    />
  );
}
