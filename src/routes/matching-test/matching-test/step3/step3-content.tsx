import { useMemo, useState } from "react";
import type { Step3ChipKey, Step3ChipsState, Step3SelectKey, Step3SelectedState } from "../../../../stores/matching-test";

import MatchingTestTopBar from "../../components/MatchingTestHeader";
import SelectChip from "../../components/SelectChip";
import FormField from "../../components/FormField";
import BottomSheet from "../../components/BottomSheet";
import InputSheet from "../../components/InputSheet";
import SelectSheet from "../../components/SelectSheet";
import CheckDropdown from "../../components/CheckDropdown";

type Props = {
  snsUrl: string;
  onSnsUrlChange: (v: string) => void;
  isValidInstagramUrl: boolean;

  step3Selected: Step3SelectedState;
  onToggleSelect: (key: Step3SelectKey, label: string) => void;

  step3Chips: Step3ChipsState;
  onToggleChip: (key: Step3ChipKey, label: string) => void;

  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
};

type Sheet = null | "snsUrl" | "gender" | "ageGroup" | "videoLength" | "views";

const GENDER = ["여성", "남성"] as const;
const AGE = ["10~20대", "20~30대", "30~40대", "40~50대", "50대~"] as const;
const VIDEO_LEN = ["~15초", "15~30초", "30~45초", "45~60초"] as const;
const VIEWS = ["~1만회", "1~10만회", "10~50만회", "50~100만회", "100만회~"] as const;

const CONTENT_FORMAT = ["인스타 스토리", "인스타 포스트", "인스타 릴스"] as const;
const CONTENT_TYPE = ["바이럴성", "리뷰", "게리디언스", "비포&애프터", "스토리/썰", "챌린지"] as const;
const CONTENT_TONE = ["전문적인", "감성적인", "유쾌/재밌는", "트렌디한", "일상적인", "수다떠는"] as const;
const CONTENT_HARDNESS = ["관여 안함", "가이드라인만 제공", "대본 일부 제공", "모든 연출 관여"] as const;
const EDITING_RANGE = ["크리에이터 1차 활용", "브랜드 2차 활용"] as const;

export default function MatchingTestStep3Content({
  snsUrl,
  onSnsUrlChange,
  isValidInstagramUrl,
  step3Selected,
  onToggleSelect,
  step3Chips,
  onToggleChip,
  canGoNext,
  onBack,
  onNext,
}: Props) {
  const [sheet, setSheet] = useState<Sheet>(null);
  const open = (s: Sheet) => setSheet(s);
  const close = () => setSheet(null);

  const max = 5;
  const chipDisabled = useMemo(
    () => ({
      contentFormat: step3Chips.contentFormat.length >= max,
      contentType: step3Chips.contentType.length >= max,
      contentTone: step3Chips.contentTone.length >= max,
      contentHardness: step3Chips.contentHardness.length >= max,
      editingRange: step3Chips.editingRange.length >= max,
    }),
    [step3Chips]
  );
  const genderValue = step3Selected.gender.join("\n");
  const ageValue = step3Selected.ageGroup.join("\n");
  const lenValue = step3Selected.videoLength[0] ?? "";
  const viewsValue = step3Selected.views[0] ?? "";

  return (
    <div className="min-h-dvh bg-white">
      {/* ✅ step1과 동일한 상단 컴포넌트만 사용 */}
      <MatchingTestTopBar step={3} totalSteps={3} onBack={onBack} />

      {/* ✅ step1 기준: px-6 */}
      <div className="px-6 pb-6">
        <h1 className="text-title1 text-text-black">
          <span className="text-core-1">콘텐츠 특성</span>을 모두 선택해주세요
        </h1>

        <div className="mt-6">
          <div className="text-sm font-semibold text-text-black">SNS 정보</div>
          <div className="mt-2 text-body2 text-text-gray3">SNS 주소를 입력해주세요</div>

          <div className="mt-2">
            <FormField
              label="인스타그램 주소"
              value={snsUrl}
              placeholder="입력하기"
              onClick={() => open("snsUrl")}
            />
          </div>

          <div className="mt-4 text-body2 text-text-gray3">주 시청자 정보를 선택해주세요</div>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <FormField label="성별" value={genderValue} placeholder="선택하기" onClick={() => open("gender")} />
            <FormField label="나이대" value={ageValue} placeholder="선택하기" onClick={() => open("ageGroup")} />
          </div>

          <div className="mt-3 text-body2 text-text-gray3">평균 영상 길이 및 조회수를 선택해주세요</div>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <FormField label="영상 길이" value={lenValue} placeholder="선택하기" onClick={() => open("videoLength")} />
            <FormField label="조회수" value={viewsValue} placeholder="선택하기" onClick={() => open("views")} />
          </div>
        </div>

        <Section title="콘텐츠 형식">
          <ChipRow>
            {CONTENT_FORMAT.map((x) => {
              const sel = step3Chips.contentFormat.includes(x);
              const disabled = !sel && chipDisabled.contentFormat;
              return (
                <SelectChip
                  key={x}
                  label={x}
                  isSelected={sel}
                  disabled={disabled}
                  onToggle={() => onToggleChip("contentFormat", x)}
                />
              );
            })}
          </ChipRow>
        </Section>

        <Section title="콘텐츠 종류">
          <ChipRow>
            {CONTENT_TYPE.map((x) => {
              const sel = step3Chips.contentType.includes(x);
              const disabled = !sel && chipDisabled.contentType;
              return (
                <SelectChip
                  key={x}
                  label={x}
                  isSelected={sel}
                  disabled={disabled}
                  onToggle={() => onToggleChip("contentType", x)}
                />
              );
            })}
          </ChipRow>
        </Section>

        <Section title="콘텐츠 톤">
          <ChipRow>
            {CONTENT_TONE.map((x) => {
              const sel = step3Chips.contentTone.includes(x);
              const disabled = !sel && chipDisabled.contentTone;
              return (
                <SelectChip
                  key={x}
                  label={x}
                  isSelected={sel}
                  disabled={disabled}
                  onToggle={() => onToggleChip("contentTone", x)}
                />
              );
            })}
          </ChipRow>
        </Section>

        <Section title="콘텐츠 관여도">
          <ChipRow>
            {CONTENT_HARDNESS.map((x) => {
              const sel = step3Chips.contentHardness.includes(x);
              const disabled = !sel && chipDisabled.contentHardness;
              return (
                <SelectChip
                  key={x}
                  label={x}
                  isSelected={sel}
                  disabled={disabled}
                  onToggle={() => onToggleChip("contentHardness", x)}
                />
              );
            })}
          </ChipRow>
        </Section>

        <Section title="콘텐츠 희망 활용 범위">
          <ChipRow>
            {EDITING_RANGE.map((x) => {
              const sel = step3Chips.editingRange.includes(x);
              const disabled = !sel && chipDisabled.editingRange;
              return (
                <SelectChip
                  key={x}
                  label={x}
                  isSelected={sel}
                  disabled={disabled}
                  onToggle={() => onToggleChip("editingRange", x)}
                />
              );
            })}
          </ChipRow>
        </Section>
      </div>

      {/* ✅ step1 기준: px-6 */}
      <div className="sticky bottom-0 bg-white px-6 pt-3 pb-6">
        <button
          type="button"
          disabled={!canGoNext}
          onClick={onNext}
          className={[
            "w-full rounded-2xl py-4 text-title1",
            canGoNext ? "bg-core-1 text-white active:opacity-90" : "bg-bluegray-2 text-text-gray3",
          ].join(" ")}
        >
          다음
        </button>
      </div>

      {sheet === "snsUrl" ? (
        <BottomSheet title="인스타그램 주소 입력" onClose={close}>
          <InputSheet
            value={snsUrl}
            placeholder="www.instagram/your_id"
            onChange={onSnsUrlChange}
            doneDisabled={snsUrl.trim().length === 0}
            onDone={close}
            helperText="예: www.instagram/your_id"
            errorText={!isValidInstagramUrl ? "www.instagram/ 으로 시작해야 해요." : undefined}
          />
        </BottomSheet>
      ) : null}



      {sheet === "gender" ? (
        <BottomSheet title="성별" onClose={close}>
          <CheckDropdown
            options={GENDER}
            values={step3Selected.gender}
            onToggle={(v) => onToggleSelect("gender", v)}
            onDone={close}
          />
        </BottomSheet>
      ) : null}


      {sheet === "ageGroup" ? (
        <BottomSheet title="나이대" onClose={close}>
          <CheckDropdown
            options={AGE}
            values={step3Selected.ageGroup}
            onToggle={(v) => onToggleSelect("ageGroup", v)}
            onDone={close}
          />
        </BottomSheet>
      ) : null}


      {sheet === "videoLength" ? (
        <BottomSheet title="영상 길이" onClose={close}>
          <SelectSheet
            options={VIDEO_LEN}
            value={lenValue}
            onSelect={(v) => {
              if (lenValue && lenValue !== v) onToggleSelect("videoLength", lenValue);
              if (lenValue !== v) onToggleSelect("videoLength", v);
              close();
            }}
          />
        </BottomSheet>
      ) : null}

      {sheet === "views" ? (
        <BottomSheet title="조회수" onClose={close}>
          <SelectSheet
            options={VIEWS}
            value={viewsValue}
            onSelect={(v) => {
              if (viewsValue && viewsValue !== v) onToggleSelect("views", viewsValue);
              if (viewsValue !== v) onToggleSelect("views", v);
              close();
            }}
          />
        </BottomSheet>
      ) : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
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
