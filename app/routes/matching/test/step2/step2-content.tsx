import { useMemo, useState } from "react";
import type {
  Step2SectionKey,
  Step2SelectedState,
  FashionBodyTags,
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
  isSelected: (section: Step2SectionKey, id: number) => boolean;
  onToggle: (section: Step2SectionKey, id: number, max: number) => void;

  fashionBody: FashionBodyTags;
  onSetFashionBody: (key: keyof FashionBodyTags, id: number | null) => void;

  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
};

type SheetType = null | "height" | "bodyShape" | "topSize" | "bottomSize";

const BODY_SHAPE_OPTIONS = [
  { id: 1, label: "마름" },
  { id: 2, label: "표준" },
  { id: 3, label: "통통" },
  { id: 4, label: "근육형" },
  { id: 5, label: "웨이브" },
] as const;

const TOP_SIZE_OPTIONS = [
  { id: 33, label: "33" },
  { id: 44, label: "44" },
  { id: 55, label: "55" },
  { id: 66, label: "66" },
  { id: 77, label: "77" },
] as const;

export default function MatchingTestStep2Content({
  isLoading,
  errorText,
  sections,
  itemsBySection,
  selected,
  isSelected,
  onToggle,
  fashionBody,
  onSetFashionBody,
  canGoNext,
  onBack,
  onNext,
}: Props) {
  const [sheet, setSheet] = useState<SheetType>(null);
  const open = (t: SheetType) => setSheet(t);
  const close = () => setSheet(null);

  const chipDisabled = useMemo(() => {
    const getMax = (k: Step2SectionKey) =>
      sections.find((s) => s.key === k)?.max ?? 5;

    return {
      fashionStyle: selected.fashionStyle.length >= getMax("fashionStyle"),
      interestItem: selected.interestItem.length >= getMax("interestItem"),
      brandType: selected.brandType.length >= getMax("brandType"),
    } satisfies Record<Step2SectionKey, boolean>;
  }, [selected, sections]);

  const heightText =
    fashionBody.heightTag === null ? "" : `${fashionBody.heightTag} cm`;
  const bottomText =
    fashionBody.bottomSizeTag === null ? "" : `${fashionBody.bottomSizeTag} in`;

  const bodyShapeText =
    fashionBody.weightTypeTag === null
      ? ""
      : (BODY_SHAPE_OPTIONS.find((o) => o.id === fashionBody.weightTypeTag)
          ?.label ?? "");

  const topSizeText =
    fashionBody.topSizeTag === null
      ? ""
      : (TOP_SIZE_OPTIONS.find((o) => o.id === fashionBody.topSizeTag)?.label ??
        String(fashionBody.topSizeTag));

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
                      key={tag.id}
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

        <div className="mt-7">
          <div className="text-sm font-semibold text-text-black">체형 정보</div>

          <div className="mt-3">
            <div className="text-body2 text-text-gray3">키를 입력해주세요</div>
            <div className="mt-2">
              <FormField
                label="키(cm)"
                value={heightText}
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
                value={bodyShapeText}
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
                value={topSizeText}
                placeholder="선택하기"
                onClick={() => open("topSize")}
              />
              <FormField
                label="하의 사이즈 (in)"
                value={bottomText}
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

      {sheet === "height" ? (
        <BottomSheet title="키 입력" onClose={close}>
          <InputSheet
            value={
              fashionBody.heightTag === null
                ? ""
                : String(fashionBody.heightTag)
            }
            placeholder="숫자만 입력"
            onChange={(v) => {
              const n = Number(v.replace(/[^\d]/g, ""));
              onSetFashionBody(
                "heightTag",
                Number.isFinite(n) && n > 0 ? n : null,
              );
            }}
            doneDisabled={fashionBody.heightTag === null}
            onDone={close}
            suffix="cm"
          />
        </BottomSheet>
      ) : null}

      {sheet === "bottomSize" ? (
        <BottomSheet title="하의 사이즈 입력" onClose={close}>
          <InputSheet
            value={
              fashionBody.bottomSizeTag === null
                ? ""
                : String(fashionBody.bottomSizeTag)
            }
            placeholder="숫자만 입력"
            onChange={(v) => {
              const n = Number(v.replace(/[^\d]/g, ""));
              onSetFashionBody(
                "bottomSizeTag",
                Number.isFinite(n) && n > 0 ? n : null,
              );
            }}
            doneDisabled={fashionBody.bottomSizeTag === null}
            onDone={close}
            suffix="in"
          />
        </BottomSheet>
      ) : null}

      {sheet === "bodyShape" ? (
        <BottomSheet title="체형 선택" onClose={close}>
          <SelectSheet
            options={BODY_SHAPE_OPTIONS.map((o) => o.label)}
            value={bodyShapeText}
            onSelect={(label) => {
              const hit = BODY_SHAPE_OPTIONS.find((o) => o.label === label);
              onSetFashionBody("weightTypeTag", hit ? hit.id : null);
              close();
            }}
          />
        </BottomSheet>
      ) : null}

      {sheet === "topSize" ? (
        <BottomSheet title="상의 사이즈 선택" onClose={close}>
          <SelectSheet
            options={TOP_SIZE_OPTIONS.map((o) => o.label)}
            value={topSizeText}
            onSelect={(label) => {
              const hit = TOP_SIZE_OPTIONS.find((o) => o.label === label);
              onSetFashionBody("topSizeTag", hit ? hit.id : null);
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
