import { useMemo, useState } from "react";
import type {
  Step2SectionKey,
  Step2SelectedState,
  TagId,
} from "../../../../stores/matching-test";
import type { TagItem } from "../_shared/tags/tags.types";

import SelectChip from "../components/SelectChip";
import FormField from "../components/FormField";
import BottomSheet from "../components/BottomSheet";
import InputSheet from "../components/InputSheet";
import SelectSheet from "../components/SelectSheet";
import MatchingTestTopBar from "../components/MatchingTestHeader";
import Button from "../../../../components/common/Button";

type Props = {
  isLoading: boolean;
  errorText: string | null;

  sections: Array<{ key: Step2SectionKey; title: string; max: number }>;
  itemsBySection: Record<Step2SectionKey, TagItem[]>;

  selected: Step2SelectedState;
  isSelected: (section: Step2SectionKey, id: TagId) => boolean;
  onToggle: (section: Step2SectionKey, id: TagId, max: number) => void;

  heightCm: string;
  bodyShape: string;
  topSize: string;
  bottomSizeIn: string;

  onHeightChange: (v: string) => void;
  onBodyShapeChange: (v: string) => void;
  onTopSizeChange: (v: string) => void;
  onBottomSizeChange: (v: string) => void;

  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
};

type SheetType = null | "height" | "bodyShape" | "topSize" | "bottomSize";

const BODY_SHAPE_OPTIONS = [
  "마름",
  "표준",
  "통통",
  "근육형",
  "웨이브",
] as const;
const TOP_SIZE_OPTIONS = ["33", "44", "55", "66", "77"] as const;

export default function MatchingTestStep2Content({
  isLoading,
  errorText,
  sections,
  itemsBySection,
  selected,
  isSelected,
  onToggle,
  heightCm,
  bodyShape,
  topSize,
  bottomSizeIn,
  onHeightChange,
  onBodyShapeChange,
  onTopSizeChange,
  onBottomSizeChange,
  canGoNext,
  onBack,
  onNext,
}: Props) {
  const [sheet, setSheet] = useState<SheetType>(null);
  const open = (t: SheetType) => setSheet(t);
  const close = () => setSheet(null);

  const chipDisabled = useMemo(() => {
    const out: Record<Step2SectionKey, boolean> = {
      fashionStyle:
        selected.fashionStyle.length >=
        (sections.find((s) => s.key === "fashionStyle")?.max ?? 5),
      interestItem:
        selected.interestItem.length >=
        (sections.find((s) => s.key === "interestItem")?.max ?? 5),
      brandType:
        selected.brandType.length >=
        (sections.find((s) => s.key === "brandType")?.max ?? 5),
    };
    return out;
  }, [selected, sections]);

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-white">
        <MatchingTestTopBar step={2} totalSteps={3} onBack={onBack} />
        <div className="px-5 py-10 text-sm text-text-gray3">
          태그를 불러오는 중...
        </div>
      </div>
    );
  }

  if (errorText) {
    return (
      <div className="min-h-dvh bg-white">
        <MatchingTestTopBar step={2} totalSteps={3} onBack={onBack} />
        <div className="px-5 py-10 text-sm text-red-500">{errorText}</div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white">
      <MatchingTestTopBar step={2} totalSteps={3} onBack={onBack} />

      <div className="px-5 pb-6">
        <h1 className="text-title1 text-text-black">
          관심 있는 <span className="text-core-1">패션 특성</span>을 <br />
          모두 선택해주세요!
        </h1>

        {/* Chips: 서버 태그 기반 */}
        {sections.map((sec) => {
          const items = itemsBySection[sec.key] ?? [];
          return (
            <Section key={sec.key} title={sec.title}>
              <ChipRow>
                {items.map((tag) => {
                  const sel = isSelected(sec.key, tag.id);
                  const disabled = !sel && (chipDisabled[sec.key] ?? false);
                  return (
                    <SelectChip
                      key={String(tag.id)}
                      label={tag.name}
                      isSelected={sel}
                      disabled={disabled}
                      onToggle={() => onToggle(sec.key, tag.id, sec.max)}
                    />
                  );
                })}
              </ChipRow>
            </Section>
          );
        })}

        {/* Body Info: 기존 그대로 */}
        <div className="mt-7">
          <div className="text-sm font-semibold text-text-black">체형 정보</div>

          <div className="mt-3">
            <div className="text-body2 text-text-gray3">키를 입력해주세요</div>
            <div className="mt-2">
              <FormField
                label="키(cm)"
                value={heightCm ? `${heightCm} cm` : ""}
                placeholder="입력하기"
                onClick={() => open("height")}
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-body2 text-text-gray3">
              체형을 선택해주세요
            </div>
            <div className="mt-2">
              <FormField
                label="체형"
                value={bodyShape}
                placeholder="선택하기"
                onClick={() => open("bodyShape")}
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-body2 text-text-gray3">
              평소 입는 옷 사이즈를 선택해주세요
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <FormField
                label="상의 사이즈"
                value={topSize}
                placeholder="선택하기"
                onClick={() => open("topSize")}
              />
              <FormField
                label="하의 사이즈 (in)"
                value={bottomSizeIn ? `${bottomSizeIn} in` : ""}
                placeholder="입력하기"
                onClick={() => open("bottomSize")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white px-5 pb-6 pt-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onNext}
          disabled={!canGoNext}
        >
          다음
        </Button>
      </div>

      {/* Sheets */}
      {sheet === "height" ? (
        <BottomSheet title="키 입력" onClose={close}>
          <InputSheet
            value={heightCm}
            placeholder="숫자만 입력"
            onChange={(v) => onHeightChange(v.replace(/[^\d]/g, ""))}
            doneDisabled={heightCm.trim().length === 0}
            onDone={close}
            suffix="cm"
          />
        </BottomSheet>
      ) : null}

      {sheet === "bottomSize" ? (
        <BottomSheet title="하의 사이즈 입력" onClose={close}>
          <InputSheet
            value={bottomSizeIn}
            placeholder="숫자만 입력"
            onChange={(v) => onBottomSizeChange(v.replace(/[^\d]/g, ""))}
            doneDisabled={bottomSizeIn.trim().length === 0}
            onDone={close}
            suffix="in"
          />
        </BottomSheet>
      ) : null}

      {sheet === "bodyShape" ? (
        <BottomSheet title="체형 선택" onClose={close}>
          <SelectSheet
            options={BODY_SHAPE_OPTIONS}
            value={bodyShape}
            onSelect={(v) => {
              onBodyShapeChange(v);
              close();
            }}
          />
        </BottomSheet>
      ) : null}

      {sheet === "topSize" ? (
        <BottomSheet title="상의 사이즈 선택" onClose={close}>
          <SelectSheet
            options={TOP_SIZE_OPTIONS}
            value={topSize}
            onSelect={(v) => {
              onTopSizeChange(v);
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
    <div className="mt-5">
      <div className="text-sm font-semibold text-text-black">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}
