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
import LoadingSpinner from "../../../../components/common/LoadingSpinner";

import type { ContentTags, TagItem } from "../_shared/tags/tags.types";

type Props = {
  tagsLoading: boolean;
  tagsError: string | null;
  contentTags: ContentTags | null;

  snsUrl: string;
  onSnsUrlChange: (v: string) => void;
  isValidInstagramUrl: boolean;

  step3Selected: Step3SelectedState;
  onToggleSelect: (key: Step3SelectKey, id: number) => void;
  onSelectSingle: (key: Step3SelectKey, id: number) => void;

  step3Chips: Step3ChipsState;
  onToggleChip: (key: Step3ChipKey, id: number) => void;

  canGoNext: boolean;
  submitting?: boolean;
  submitError?: string | null;

  onBack: () => void;
  onNext: () => void;
};

type Sheet = null | "snsUrl" | "gender" | "ageGroup" | "videoLength" | "views";
const EMPTY_TAGS: TagItem[] = [];

const INSTAGRAM_PREFIX = "https://instagram.com/";

const extractId = (url: string) => url.replace(INSTAGRAM_PREFIX, "").trim();

const isValidInstagramId = (id: string) => /^[A-Za-z0-9._]{1,30}$/.test(id);

const sortById = (items: TagItem[]) => [...items].sort((a, b) => a.id - b.id);

const namesByIds = (ids: number[], options: TagItem[]) =>
  options.filter((o) => ids.includes(o.id)).map((o) => o.name);

const joinNames = (ids: number[], options: TagItem[]) =>
  namesByIds(ids, options).join("\n");

const idByName = (name: string, options: TagItem[]) =>
  options.find((o) => o.name === name)?.id;

const nameById = (id: number | undefined, options: TagItem[]) =>
  id == null ? "" : (options.find((o) => o.id === id)?.name ?? "");

export default function MatchingTestStep3Content({
  tagsLoading,
  tagsError,
  contentTags,

  snsUrl,
  onSnsUrlChange,

  step3Selected,
  onToggleSelect,
  onSelectSingle,

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

  const genderOptions = useMemo(
    () => sortById(contentTags?.viewerGenders ?? EMPTY_TAGS),
    [contentTags?.viewerGenders],
  );
  const ageOptions = useMemo(
    () => sortById(contentTags?.viewerAges ?? EMPTY_TAGS),
    [contentTags?.viewerAges],
  );
  const videoLenOptions = useMemo(
    () => sortById(contentTags?.avgVideoLengths ?? EMPTY_TAGS),
    [contentTags?.avgVideoLengths],
  );
  const viewsOptions = useMemo(
    () => sortById(contentTags?.avgVideoViews ?? EMPTY_TAGS),
    [contentTags?.avgVideoViews],
  );

  const formatOptions = useMemo(
    () => sortById(contentTags?.formats ?? EMPTY_TAGS),
    [contentTags?.formats],
  );

  const typeOptions = useMemo(
    () => sortById(contentTags?.categories ?? EMPTY_TAGS),
    [contentTags?.categories],
  );
  const toneOptions = useMemo(
    () => sortById(contentTags?.tones ?? EMPTY_TAGS),
    [contentTags?.tones],
  );
  const involvementOptions = useMemo(
    () => sortById(contentTags?.involvements ?? EMPTY_TAGS),
    [contentTags?.involvements],
  );
  const coverageOptions = useMemo(
    () => sortById(contentTags?.usageRanges ?? EMPTY_TAGS),
    [contentTags?.usageRanges],
  );

  const genderValue = useMemo(
    () => joinNames(step3Selected.gender, genderOptions),
    [step3Selected.gender, genderOptions],
  );
  const ageValue = useMemo(
    () => joinNames(step3Selected.ageGroup, ageOptions),
    [step3Selected.ageGroup, ageOptions],
  );

  const lenValue = useMemo(
    () => nameById(step3Selected.videoLength[0], videoLenOptions),
    [step3Selected.videoLength, videoLenOptions],
  );
  const viewsValue = useMemo(
    () => nameById(step3Selected.views[0], viewsOptions),
    [step3Selected.views, viewsOptions],
  );

  return (
    <div className="w-full min-h-full bg-white flex flex-col">
      <MatchingTestTopBar step={3} totalSteps={3} onBack={onBack} />

      {tagsLoading ? (
        <LoadingSpinner className="py-10" />
      ) : tagsError ? (
        <div className="px-6 py-10 text-sm text-red-500">{tagsError}</div>
      ) : null}

      <main className="flex-1 px-6 pb-7.5 bg-white">
        <h1 className="text-title leading-8 text-text-black">
          <span className="text-core-1">콘텐츠 특성</span>을{" "}
          <span className="text-core-1">모두</span> 선택해주세요
        </h1>

        <section className="mt-8">
          <h2 className="text-title2 text-text-black mb-2">SNS 정보</h2>

          <div className="text-title4 text-text-gray3">
            SNS 주소를 입력해주세요
          </div>
          <div className="mt-2">
            <FormField
              label="인스타그램 주소"
              value={
                snsUrl
                  ? snsUrl.startsWith(INSTAGRAM_PREFIX)
                    ? snsUrl
                    : INSTAGRAM_PREFIX + snsUrl
                  : INSTAGRAM_PREFIX
              }
              placeholder="아이디 입력"
              onClick={() => open("snsUrl")}
            />
          </div>

          <div className="mt-4 text-callout1 text-text-gray3">
            주 시청자 정보를 선택해주세요
          </div>
          <div className="mt-2 grid grid-cols-2 gap-3 items-stretch">
            <FormField
              label="성별"
              value={genderValue}
              placeholder="선택하기"
              onClick={() => open("gender")}
            />
            <FormField
              label="나이대"
              value={ageValue}
              placeholder="선택하기"
              onClick={() => open("ageGroup")}
            />
          </div>

          <div className="mt-4 text-title4 text-text-gray3">
            평균 영상 길이 및 조회수를 선택해주세요
          </div>
          <div className="mt-2 grid grid-cols-2 gap-3 items-stretch">
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
        </section>

        <Section title="콘텐츠 형식">
          <ChipRow>
            {formatOptions.map((t) => (
              <SelectChip
                key={t.id}
                label={t.name}
                isSelected={step3Chips.contentFormat.includes(t.id)}
                onToggle={() => onToggleChip("contentFormat", t.id)}
              />
            ))}
          </ChipRow>
        </Section>

        <Section title="콘텐츠 종류">
          <ChipRow>
            {typeOptions.map((t) => (
              <SelectChip
                key={t.id}
                label={t.name}
                isSelected={step3Chips.contentType.includes(t.id)}
                onToggle={() => onToggleChip("contentType", t.id)}
              />
            ))}
          </ChipRow>
        </Section>

        <Section title="콘텐츠 톤">
          <ChipRow>
            {toneOptions.map((t) => (
              <SelectChip
                key={t.id}
                label={t.name}
                isSelected={step3Chips.contentTone.includes(t.id)}
                onToggle={() => onToggleChip("contentTone", t.id)}
              />
            ))}
          </ChipRow>
        </Section>

        <Section title="콘텐츠 관여도">
          <ChipRow>
            {involvementOptions.map((t) => (
              <SelectChip
                key={t.id}
                label={t.name}
                isSelected={step3Chips.contentHardness.includes(t.id)}
                onToggle={() => onToggleChip("contentHardness", t.id)}
              />
            ))}
          </ChipRow>
        </Section>

        <Section title="콘텐츠 희망 활용 범위">
          <ChipRow>
            {coverageOptions.map((t) => (
              <SelectChip
                key={t.id}
                label={t.name}
                isSelected={step3Chips.editingRange.includes(t.id)}
                onToggle={() => onToggleChip("editingRange", t.id)}
              />
            ))}
          </ChipRow>
        </Section>
      </main>

      <div className="sticky bottom-0 w-full bg-white px-6 pt-6 pb-6">
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

      {sheet === "snsUrl" ? (
        <BottomSheet title="인스타그램 주소 입력" onClose={close}>
          <InputSheet
            inputMode="text"
            type="text"
            autoCapitalize="none"
            value={extractId(snsUrl)}
            placeholder="아이디만 입력"
            onChange={(v) => {
              const cleaned = extractId(v);
              onSnsUrlChange(INSTAGRAM_PREFIX + cleaned);
            }}
            doneDisabled={!isValidInstagramId(extractId(snsUrl))}
            onDone={close}
            helperText=""
            errorText={
              extractId(snsUrl).length > 0 &&
              !isValidInstagramId(extractId(snsUrl))
                ? "영문, 숫자, '.', '_' 만 입력할 수 있어요."
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
              if (id != null) onSelectSingle("videoLength", id);
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
              if (id != null) onSelectSingle("views", id);
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
    <section className="mt-8">
      <h2 className="text-title2 text-text-black mb-2">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-3">{children}</div>;
}
