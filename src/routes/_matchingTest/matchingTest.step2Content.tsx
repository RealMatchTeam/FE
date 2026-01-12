import { useMemo, useState } from "react";
import type { Step2SectionKey, Step2SelectedState } from "./matchingTest.store";

import SelectChip from "./components/SelectChip";
import FormField from "./components/FormField";
import BottomSheet from "./components/BottomSheet";
import InputSheet from "./components/InputSheet";
import SelectSheet from "./components/SelectSheet";


type Props = {
  progressText: string;
  maxText: string;
  maxPerSection: number;

  selected: Step2SelectedState;
  isSelected: (section: Step2SectionKey, label: string) => boolean;
  onToggle: (section: Step2SectionKey, label: string) => void;

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

const CONTAINER = "mx-auto w-full max-w-[420px]";
type SheetType = null | "height" | "bodyShape" | "topSize" | "bottomSize";

// ✅ 옵션은 네 서비스에 맞게 바꿔도 됨
const STYLE = ["미니멀", "페미닌", "러블리", "비즈니스 캐주얼", "캐주얼", "스트리트"] as const;
const ITEM = ["의류", "가방", "신발", "주얼리", "패션 소품"] as const;
const BRAND = ["SPA", "빈티지", "중가 브랜드", "디자이너 브랜드", "명품 브랜드"] as const;

const BODY_SHAPE_OPTIONS = ["마름", "표준", "통통", "근육형", "웨이브"] as const;
const TOP_SIZE_OPTIONS = ["33", "44", "55", "66", "77"] as const;

export default function MatchingTestStep2Content({
  progressText,
  maxText,
  maxPerSection,
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

  // ✅ step1과 동일한 UX: max 도달 시 “선택 안 된 것들만” disabled 처리
  const chipDisabled = useMemo(() => {
    return {
      fashionStyle: selected.fashionStyle.length >= maxPerSection,
      interestItem: selected.interestItem.length >= maxPerSection,
      brandType: selected.brandType.length >= maxPerSection,
    };
  }, [selected, maxPerSection]);

  return (
    <div className="min-h-dvh bg-white">
      <div className={CONTAINER}>
        {/* progress */}
        <div className="pt-2">
          <div className="h-[2px] w-full bg-bluegray-2">
            <div className="h-[2px] w-2/3 bg-core-1" />
          </div>
        </div>

        <div className="px-5 pb-6 pt-4">
          {/* header */}
          <div className="relative mb-5 flex items-start justify-center">
            <button
              type="button"
              onClick={onBack}
              className="absolute left-0 top-0 rounded-md p-2 text-text-gray2 active:opacity-90"
              aria-label="back"
            >
              ←
            </button>
            <div className="text-sm text-text-gray3">{progressText}</div>
          </div>

          <h1 className="text-title1 text-text-black">
            관심 있는 <span className="text-core-1">패션 특성</span>을 <br />
            모두 선택해주세요!
          </h1>
          <p className="mt-2 text-body2 text-text-gray3">{maxText}</p>

          {/* Chips */}
          <Section title="관심 스타일">
            <ChipRow>
              {STYLE.map((label) => {
                const sel = isSelected("fashionStyle", label);
                const disabled = !sel && chipDisabled.fashionStyle;
                return (
                  <SelectChip
                    key={label}
                    label={label}
                    isSelected={sel}
                    disabled={disabled}
                    onToggle={() => onToggle("fashionStyle", label)}
                  />
                );
              })}
            </ChipRow>
          </Section>

          <Section title="관심 아이템/분야">
            <ChipRow>
              {ITEM.map((label) => {
                const sel = isSelected("interestItem", label);
                const disabled = !sel && chipDisabled.interestItem;
                return (
                  <SelectChip
                    key={label}
                    label={label}
                    isSelected={sel}
                    disabled={disabled}
                    onToggle={() => onToggle("interestItem", label)}
                  />
                );
              })}
            </ChipRow>
          </Section>

          <Section title="관심 브랜드 종류">
            <ChipRow>
              {BRAND.map((label) => {
                const sel = isSelected("brandType", label);
                const disabled = !sel && chipDisabled.brandType;
                return (
                  <SelectChip
                    key={label}
                    label={label}
                    isSelected={sel}
                    disabled={disabled}
                    onToggle={() => onToggle("brandType", label)}
                  />
                );
              })}
            </ChipRow>
          </Section>

          {/* Body Info */}
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
              <div className="text-body2 text-text-gray3">체형을 선택해주세요</div>
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
              <div className="text-body2 text-text-gray3">평소 입는 옷 사이즈를 선택해주세요</div>
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

        {/* CTA */}
        <div className="sticky bottom-0 bg-white px-5 pb-6 pt-3">
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

/* ============== local layout helpers ============== */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
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
