import { useMemo, useState } from "react";
import type {
  Step3ChipKey,
  Step3ChipsState,
  Step3SelectKey,
  Step3SelectedState,
} from "../../../../stores/matching-test";

import MatchingTestTopBar from "../components/MatchingTestHeader";
import SelectChip from "../components/SelectChip";
import FormField from "../components/FormField";
import BottomSheet from "../components/BottomSheet";
import InputSheet from "../components/InputSheet";
import SelectSheet from "../components/SelectSheet";
import CheckDropdown from "../components/CheckDropdown";
import Button from "../../../../components/common/Button";

/**
 * ✅ 너 tags.types.ts 구조에 맞춰 contentTags 타입을 맞춰줘야 함
 * 여기서는 "step3에서 필요한 최소 형태"만 정의
 */
type TagItem = { id: number; name: string };

type ContentTags = {
  // 콘텐츠 성격(칩)
  categories: TagItem[]; // -> typeTags
  tones: TagItem[]; // -> toneTags
  involvements: TagItem[]; // -> prefferedInvolvementTags
  usageRanges: TagItem[]; // -> prefferedCoverageTags

  // 시청자/평균지표(드롭다운)
  genderTags: TagItem[];
  ageTags: TagItem[];
  videoLengthTags: TagItem[];
  videoViewsTags: TagItem[];
};

type Props = {
  // ✅ route에서 내려줌
  tagsLoading: boolean;
  tagsError: string | null;
  contentTags: ContentTags | null;

  snsUrl: string;
  onSnsUrlChange: (v: string) => void;
  isValidInstagramUrl: boolean;

  step3Selected: Step3SelectedState;
  onToggleSelect: (key: Step3SelectKey, id: number) => void;

  step3Chips: Step3ChipsState;
  onToggleChip: (key: Step3ChipKey, id: number) => void;

  canGoNext: boolean;
  submitting?: boolean;
  submitError?: string | null;

  onBack: () => void;
  onNext: () => void;
};

type Sheet = null | "snsUrl" | "gender" | "ageGroup" | "videoLength" | "views";

export default function MatchingTestStep3Content({
  tagsLoading,
  tagsError,
  contentTags,

  snsUrl,
  onSnsUrlChange,
  isValidInstagramUrl,
  step3Selected,
  onToggleSelect,
  step3Chips,
  onToggleChip,
  canGoNext,
  submitting = false,
  submitError = null,
  onBack,
  onNext,
}: Props) {
  const [sheet, setSheet] = useState<Sheet>(null);
  const open = (s: Sheet) => setSheet(s);
  const close = () => setSheet(null);

  // 태그가 아직 없으면 빈 배열
  const genderOptions = contentTags?.genderTags ?? [];
  const ageOptions = contentTags?.ageTags ?? [];
  const videoLenOptions = contentTags?.videoLengthTags ?? [];
  const viewsOptions = contentTags?.videoViewsTags ?? [];

  const typeOptions = contentTags?.categories ?? [];
  const toneOptions = contentTags?.tones ?? [];
  const involvementOptions = contentTags?.involvements ?? [];
  const coverageOptions = contentTags?.usageRanges ?? [];

  // id[] -> 표시용 name들
  const namesByIds = (ids: number[], options: TagItem[]) =>
    options.filter((o) => ids.includes(o.id)).map((o) => o.name);

  const joinNames = (ids: number[], options: TagItem[]) =>
    namesByIds(ids, options).join("\n");

  // name -> id
  const idByName = (name: string, options: TagItem[]) =>
    options.find((o) => o.name === name)?.id;

  // 단일 선택 sheet 값(SelectSheet는 보통 string 하나)
  const lenValue =
    namesByIds(step3Selected.videoLength, videoLenOptions)[0] ?? "";
  const viewsValue = namesByIds(step3Selected.views, viewsOptions)[0] ?? "";

  // 칩 max 5개 제한
  const max = 5;
  const chipDisabled = useMemo(
    () => ({
      contentType: step3Chips.contentType.length >= max,
      contentTone: step3Chips.contentTone.length >= max,
      contentHardness: step3Chips.contentHardness.length >= max,
      editingRange: step3Chips.editingRange.length >= max,
    }),
    [step3Chips],
  );

  return (
    <div className="min-h-dvh bg-white">
      <MatchingTestTopBar step={3} totalSteps={3} onBack={onBack} />

      {/* 태그 로딩/에러 */}
      {tagsLoading ? (
        <div className="px-6 py-6 text-sm text-text-gray3">
          태그를 불러오는 중...
        </div>
      ) : tagsError ? (
        <div className="px-6 py-6 text-sm text-red-500">{tagsError}</div>
      ) : null}

      <div className="px-6 pb-6">
        <h1 className="text-title1 text-text-black">
          <span className="text-core-1">콘텐츠 특성</span>을 모두 선택해주세요
        </h1>

        {/* SNS */}
        <div className="mt-6">
          <div className="text-sm font-semibold text-text-black">SNS 정보</div>
          <div className="mt-2 text-body2 text-text-gray3">
            SNS 주소를 입력해주세요
          </div>

          <div className="mt-2">
            <FormField
              label="인스타그램 주소"
              value={snsUrl}
              placeholder="입력하기"
              onClick={() => open("snsUrl")}
            />
          </div>

          <div className="mt-4 text-body2 text-text-gray3">
            주 시청자 정보를 선택해주세요
          </div>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <FormField
              label="성별"
              value={joinNames(step3Selected.gender, genderOptions)}
              placeholder="선택하기"
              onClick={() => open("gender")}
            />
            <FormField
              label="나이대"
              value={joinNames(step3Selected.ageGroup, ageOptions)}
              placeholder="선택하기"
              onClick={() => open("ageGroup")}
            />
          </div>

          <div className="mt-3 text-body2 text-text-gray3">
            평균 영상 길이 및 조회수를 선택해주세요
          </div>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <FormField
              label="영상 길이"
              value={lenValue}
              placeholder="선택하기"
              onClick={() => open("videoLength")}
            />
            <FormField
              label="조회수"
              value={viewsValue}
              placeholder="선택하기"
              onClick={() => open("views")}
            />
          </div>
        </div>

        {/* 칩: 콘텐츠 종류(typeTags) */}
        <Section title="콘텐츠 종류">
          <ChipRow>
            {typeOptions.map((t) => {
              const sel = step3Chips.contentType.includes(t.id);
              const disabled = !sel && chipDisabled.contentType;
              return (
                <SelectChip
                  key={t.id}
                  label={t.name}
                  isSelected={sel}
                  disabled={disabled}
                  onToggle={() => onToggleChip("contentType", t.id)}
                />
              );
            })}
          </ChipRow>
        </Section>

        {/* 칩: 콘텐츠 톤(toneTags) */}
        <Section title="콘텐츠 톤">
          <ChipRow>
            {toneOptions.map((t) => {
              const sel = step3Chips.contentTone.includes(t.id);
              const disabled = !sel && chipDisabled.contentTone;
              return (
                <SelectChip
                  key={t.id}
                  label={t.name}
                  isSelected={sel}
                  disabled={disabled}
                  onToggle={() => onToggleChip("contentTone", t.id)}
                />
              );
            })}
          </ChipRow>
        </Section>

        {/* 칩: 관여도(involvementTags) */}
        <Section title="콘텐츠 관여도">
          <ChipRow>
            {involvementOptions.map((t) => {
              const sel = step3Chips.contentHardness.includes(t.id);
              const disabled = !sel && chipDisabled.contentHardness;
              return (
                <SelectChip
                  key={t.id}
                  label={t.name}
                  isSelected={sel}
                  disabled={disabled}
                  onToggle={() => onToggleChip("contentHardness", t.id)}
                />
              );
            })}
          </ChipRow>
        </Section>

        {/* 칩: 활용 범위(coverageTags) */}
        <Section title="콘텐츠 희망 활용 범위">
          <ChipRow>
            {coverageOptions.map((t) => {
              const sel = step3Chips.editingRange.includes(t.id);
              const disabled = !sel && chipDisabled.editingRange;
              return (
                <SelectChip
                  key={t.id}
                  label={t.name}
                  isSelected={sel}
                  disabled={disabled}
                  onToggle={() => onToggleChip("editingRange", t.id)}
                />
              );
            })}
          </ChipRow>
        </Section>
      </div>

      {/* CTA */}
      <div className="sticky bottom-0 bg-white px-6 pt-3 pb-6">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onNext}
          disabled={!canGoNext || submitting || tagsLoading || !!tagsError}
        >
          {submitting ? "제출 중..." : "매칭 결과 보기"}
        </Button>

        {submitError ? (
          <div className="mt-2 text-xs text-red-500">{submitError}</div>
        ) : null}
      </div>

      {/* Sheets */}
      {sheet === "snsUrl" ? (
        <BottomSheet title="인스타그램 주소 입력" onClose={close}>
          <InputSheet
            value={snsUrl}
            placeholder="www.instagram/your_id"
            onChange={onSnsUrlChange}
            doneDisabled={snsUrl.trim().length === 0}
            onDone={close}
            helperText="예: www.instagram/your_id"
            errorText={
              !isValidInstagramUrl
                ? "www.instagram/ 으로 시작해야 해요."
                : undefined
            }
          />
        </BottomSheet>
      ) : null}

      {sheet === "gender" ? (
        <BottomSheet title="성별" onClose={close}>
          <CheckDropdown
            options={genderOptions.map((x) => x.name)}
            values={namesByIds(step3Selected.gender, genderOptions)}
            onToggle={(name) => {
              const id = idByName(name, genderOptions);
              if (id != null) onToggleSelect("gender", id);
            }}
            onDone={close}
          />
        </BottomSheet>
      ) : null}

      {sheet === "ageGroup" ? (
        <BottomSheet title="나이대" onClose={close}>
          <CheckDropdown
            options={ageOptions.map((x) => x.name)}
            values={namesByIds(step3Selected.ageGroup, ageOptions)}
            onToggle={(name) => {
              const id = idByName(name, ageOptions);
              if (id != null) onToggleSelect("ageGroup", id);
            }}
            onDone={close}
          />
        </BottomSheet>
      ) : null}

      {sheet === "videoLength" ? (
        <BottomSheet title="영상 길이" onClose={close}>
          <SelectSheet
            options={videoLenOptions.map((x) => x.name)}
            value={lenValue}
            onSelect={(name) => {
              const id = idByName(name, videoLenOptions);
              if (id != null) onToggleSelect("videoLength", id);
              close();
            }}
          />
        </BottomSheet>
      ) : null}

      {sheet === "views" ? (
        <BottomSheet title="조회수" onClose={close}>
          <SelectSheet
            options={viewsOptions.map((x) => x.name)}
            value={viewsValue}
            onSelect={(name) => {
              const id = idByName(name, viewsOptions);
              if (id != null) onToggleSelect("views", id);
              close();
            }}
          />
        </BottomSheet>
      ) : null}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <div className="text-sm font-semibold text-text-black">{title}</div>
      <div className="mt-2">{children}</div>
    </section>
  );
}
function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}
