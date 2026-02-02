import { useNavigate } from "react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import MatchingTestStep3Content from "./step3-content";
import { useMatchingTestStore, type Step3ChipKey, type Step3SelectKey } from "../../../../stores/matching-test";
import { useMatchResultStore } from "../../../../stores/matching-result";
import { useAuthStore } from "../../../../stores/auth-store";
import { tokenStorage } from "../../../../lib/token";
import { analyzeMatch, type MatchRequestDto } from "../../api/matching";

export default function MatchingTestStep3Page() {
  const navigate = useNavigate();
  const MAX_CHIP = 5;
  const MAX_MULTI = 5;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const snsUrl = useMatchingTestStore((s) => s.snsUrl);
  const setSnsUrl = useMatchingTestStore((s) => s.setSnsUrl);

  const isValidInstagramUrl = useMatchingTestStore((s) => s.isValidInstagramUrl());

  const step3Selected = useMatchingTestStore((s) => s.step3Selected);
  const toggleSelect = useMatchingTestStore((s) => s.toggleStep3Select);

  const step3Chips = useMatchingTestStore((s) => s.step3Chips);
  const toggleChip = useMatchingTestStore((s) => s.toggleStep3Chip);

  // step1, step2 데이터
  const step1Selected = useMatchingTestStore((s) => s.selected);
  const step2Selected = useMatchingTestStore((s) => s.step2Selected);
  const heightCm = useMatchingTestStore((s) => s.heightCm);
  const topSize = useMatchingTestStore((s) => s.topSize);
  const bottomSizeIn = useMatchingTestStore((s) => s.bottomSizeIn);
  const resetAll = useMatchingTestStore((s) => s.resetAll);

  const setApiResult = useMatchResultStore((s) => s.setApiResult);
  const me = useAuthStore((s) => s.me);

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

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const userId = tokenStorage.getUserId() || me?.id || "1";

      // API 요청 데이터 구성
      const requestData: MatchRequestDto = {
        userId,
        sex: step3Selected.gender[0] || "여성",
        age: 25, // TODO: 실제 사용자 나이로 대체
        height: parseInt(heightCm) || 165,
        weight: 55, // TODO: 실제 사용자 체중으로 대체
        size: {
          upper: parseInt(topSize) || 55,
          bottom: parseInt(bottomSizeIn) || 26,
        },
        beauty: {
          interests: step1Selected.style,
          functions: step1Selected.function,
          skinType: step1Selected.skinType[0] || "",
          skinTone: step1Selected.skinTone[0] || "",
          makeupStyle: step1Selected.makeupStyle[0] || "",
        },
        fashion: {
          styles: step2Selected.fashionStyle,
          items: step2Selected.interestItem,
          preferredBrands: step2Selected.brandType,
        },
        sns: {
          url: snsUrl.startsWith("http") ? snsUrl : `https://${snsUrl}`,
          mainAudience: {
            sex: step3Selected.gender,
            age: step3Selected.ageGroup,
          },
          contentStyle: {
            avgVideoLength: step3Selected.videoLength[0] || "",
            avgViews: step3Selected.views[0] || "",
            format: step3Chips.contentFormat[0] || "",
            type: step3Chips.contentType[0] || "",
            contributionLevel: step3Chips.contentHardness[0] || "",
            usageCoverage: step3Chips.editingRange[0] || "",
          },
        },
      };

      // API 호출
      const result = await analyzeMatch(requestData);

      // 결과 저장
      setApiResult(result);

      // 매칭 테스트 완료 표시
      useAuthStore.getState().setMe({
        ...me,
        matchingTestDone: true,
      });

      // 테스트 데이터 초기화
      resetAll();

      // 결과 페이지로 이동
      navigate("/matching/test/result");
    } catch (error) {
      console.error("매칭 분석 실패:", error);
      toast.error("매칭 분석 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MatchingTestStep3Content
      snsUrl={snsUrl}
      onSnsUrlChange={setSnsUrl}
      isValidInstagramUrl={isValidInstagramUrl}
      step3Selected={step3Selected}
      onToggleSelect={onToggleSelect}
      step3Chips={step3Chips}
      onToggleChip={onToggleChip}
      canGoNext={canGoNext && !isSubmitting}
      onBack={() => navigate("/matching/test/step2")}
      onNext={handleSubmit}
    />
  );
}
