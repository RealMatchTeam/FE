import { useMemo, useState } from "react";
import MatchingTestTopBar from "../components/MatchingTestHeader";
import SelectChip from "../components/SelectChip";
import Button from "../../../../components/common/Button";

import BottomSheet from "../components/BottomSheet";
import InputSheet from "../components/InputSheet";
import SelectSheet from "../components/SelectSheet";
import FormField from "../components/FormField";

import type {
  FashionBodyTags,
  Step2SectionKey,
  Step2SelectedState,
} from "../../../../stores/matching-test";
import type { TagItem } from "../_shared/tags/tags.types";

type Props = {
  isLoading: boolean;
  errorText: string | null;

  sections: Array<{ key: Step2SectionKey; title: string }>;
  itemsBySection: Record<Step2SectionKey, TagItem[]>;
  selected: Step2SelectedState;

  isSelected: (section: Step2SectionKey, id: number) => boolean;
  onToggle: (section: Step2SectionKey, id: number) => void;

  fashionBody: FashionBodyTags;
  onSetFashionBody: (key: keyof FashionBodyTags, id: number | null) => void;

  fashionCategories: Record<string, TagItem[]>;

  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
};

type Sheet = null | "height" | "weightType" | "topSize" | "bottomSize";

const normalize = (s: string) => s.replace(/\s+/g, "").trim();
const sortById = (items: TagItem[]) => [...items].sort((a, b) => a.id - b.id);

const parseLeadingInt = (name: string) => {
  const m = name.match(/\d+/);
  return m ? Number(m[0]) : null;
};

const filterByNumericRange = (items: TagItem[], min: number, max: number) => {
  return items.filter((t) => {
    const n = parseLeadingInt(t.name);
    return n != null && n >= min && n <= max;
  });
};

const pickCategory = (
  categories: Record<string, TagItem[]>,
  candidates: readonly string[],
): TagItem[] => {
  for (const key of candidates) {
    const v = categories[key];
    if (Array.isArray(v)) return v;
  }
  const keys = Object.keys(categories);
  for (const cand of candidates) {
    const hit = keys.find((k) => normalize(k) === normalize(cand));
    if (hit) {
      const v = categories[hit];
      if (Array.isArray(v)) return v;
    }
  }
  return [];
};

const idByName = (name: string, options: TagItem[]) =>
  options.find((o) => normalize(o.name) === normalize(name))?.id ?? null;

const nameById = (id: number | null, options: TagItem[]) =>
  id == null ? "" : (options.find((o) => o.id === id)?.name ?? "");

const idByNumericInput = (raw: string, options: TagItem[], suffix: string) => {
  const v = raw.trim();
  if (!/^\d+$/.test(v)) return null;
  return idByName(suffix ? `${v}${suffix}` : v, options);
};

export default function MatchingTestStep2Content({
  isLoading,
  errorText,

  sections,
  itemsBySection,
  isSelected,
  onToggle,

  fashionBody,
  onSetFashionBody,
  fashionCategories,

  canGoNext,
  onBack,
  onNext,
}: Props) {
  const [sheet, setSheet] = useState<Sheet>(null);
  const open = (s: Sheet) => setSheet(s);
  const close = () => setSheet(null);

  const [heightInput, setHeightInput] = useState("");
  const [bottomInput, setBottomInput] = useState("");

  const heightOptions = useMemo(() => {
    const raw = pickCategory(fashionCategories, ["키"]);
    return sortById(filterByNumericRange(raw, 140, 200));
  }, [fashionCategories]);

  const weightTypeOptions = useMemo(() => {
    const raw = pickCategory(fashionCategories, ["체형"]);
    return sortById(raw);
  }, [fashionCategories]);

  const topSizeOptions = useMemo(() => {
    const raw = pickCategory(fashionCategories, ["상의 사이즈"]);
    return sortById(raw);
  }, [fashionCategories]);

  const bottomSizeOptions = useMemo(() => {
    const raw = pickCategory(fashionCategories, ["하의 사이즈"]);
    return sortById(filterByNumericRange(raw, 23, 65));
  }, [fashionCategories]);

  const heightValue = useMemo(
    () => nameById(fashionBody.heightTag, heightOptions),
    [fashionBody.heightTag, heightOptions],
  );
  const weightValue = useMemo(
    () => nameById(fashionBody.weightTypeTag, weightTypeOptions),
    [fashionBody.weightTypeTag, weightTypeOptions],
  );
  const topSizeValue = useMemo(
    () => nameById(fashionBody.topSizeTag, topSizeOptions),
    [fashionBody.topSizeTag, topSizeOptions],
  );
  const bottomValue = useMemo(
    () => nameById(fashionBody.bottomSizeTag, bottomSizeOptions),
    [fashionBody.bottomSizeTag, bottomSizeOptions],
  );

  const heightNum =
    heightInput.trim().length > 0 && /^\d+$/.test(heightInput.trim())
      ? Number(heightInput.trim())
      : null;

  const bottomNum =
    bottomInput.trim().length > 0 && /^\d+$/.test(bottomInput.trim())
      ? Number(bottomInput.trim())
      : null;

  const heightInRange =
    heightNum != null && heightNum >= 140 && heightNum <= 200;
  const bottomInRange = bottomNum != null && bottomNum >= 23 && bottomNum <= 65;

  if (isLoading) {
    return (
      <div className="w-full min-h-full bg-white flex flex-col">
        <MatchingTestTopBar step={2} totalSteps={3} onBack={onBack} />
        <div className="px-6 py-10 text-sm text-text-gray3">
          태그를 불러오는 중...
        </div>
      </div>
    );
  }

  if (errorText) {
    return (
      <div className="w-full min-h-full bg-white flex flex-col">
        <MatchingTestTopBar step={2} totalSteps={3} onBack={onBack} />
        <div className="px-6 py-10 text-sm text-red-500">{errorText}</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full bg-white flex flex-col">
      <MatchingTestTopBar step={2} totalSteps={3} onBack={onBack} />

      <main className="flex-1 px-6 pb-[30px] bg-white">
        <h1 className="text-title leading-[32px] text-text-black">
          관심 있는 <span className="text-core-1">패션 특성</span>을
          <br />
          <span className="text-core-1">모두</span> 선택해주세요
        </h1>

        {sections.map((section) => {
          const items = sortById(itemsBySection[section.key] ?? []);
          return (
            <section key={section.key} className="mt-8 bg-white">
              <h2 className="text-title2 text-text-black mb-2 bg-white">
                {section.title}
              </h2>
              <div className="flex flex-wrap gap-3 bg-white">
                {items.map((tag) => {
                  const checked = isSelected(section.key, tag.id);
                  return (
                    <SelectChip
                      key={tag.id}
                      label={tag.name}
                      isSelected={checked}
                      onToggle={() => onToggle(section.key, tag.id)}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}

        <section className="mt-8 bg-white">
          <h2 className="text-title2 text-text-black mb-2 bg-white">
            체형 정보
          </h2>

          <div className="text-title4 text-text-gray3 bg-white">
            키를 입력해주세요
          </div>
          <div className="mt-2">
            <FormField
              label="키(cm)"
              value={heightValue}
              placeholder="입력하기"
              onClick={() => {
                setHeightInput(heightValue.replace("cm", ""));
                open("height");
              }}
            />
          </div>

          <div className="mt-4 text-title4 text-text-gray3 bg-white">
            체형을 선택해주세요
          </div>
          <div className="mt-2">
            <FormField
              label="체형"
              value={weightValue}
              placeholder="선택하기"
              onClick={() => open("weightType")}
            />
          </div>

          <div className="mt-4 text-title4 text-text-gray3">
            평소 입는 옷 사이즈를 선택해주세요
          </div>
          <div className="mt-2 grid grid-cols-2 gap-3 items-stretch bg-white">
            <FormField
              label="상의 사이즈"
              value={topSizeValue}
              placeholder="선택하기"
              onClick={() => open("topSize")}
            />
            <FormField
              label="하의 사이즈 (in)"
              value={bottomValue}
              placeholder="입력하기"
              onClick={() => {
                setBottomInput(bottomValue);
                open("bottomSize");
              }}
            />
          </div>
        </section>
      </main>

      <div className="sticky bottom-0 w-full bg-white px-6 pt-3 pb-6">
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
            value={heightInput}
            placeholder="키를 입력해주세요"
            onChange={setHeightInput}
            doneDisabled={!heightInRange}
            onDone={() => {
              const id = idByNumericInput(heightInput, heightOptions, "cm");
              if (id != null) onSetFashionBody("heightTag", id);
              close();
            }}
            helperText="cm"
            errorText={
              heightInput.trim().length > 0 && !heightInRange
                ? "* 140~200 사이 숫자만 입력해주세요."
                : undefined
            }
          />
        </BottomSheet>
      ) : null}

      {sheet === "bottomSize" ? (
        <BottomSheet title="하의 사이즈 입력" onClose={close}>
          <InputSheet
            value={bottomInput}
            placeholder="하의 사이즈를 입력해주세요"
            onChange={setBottomInput}
            doneDisabled={!bottomInRange}
            onDone={() => {
              const id = idByNumericInput(bottomInput, bottomSizeOptions, "");
              if (id != null) onSetFashionBody("bottomSizeTag", id);
              close();
            }}
            helperText="in"
            errorText={
              bottomInput.trim().length > 0 && !bottomInRange
                ? "* 23~65 사이 숫자만 입력해주세요."
                : undefined
            }
          />
        </BottomSheet>
      ) : null}

      {sheet === "weightType" ? (
        <BottomSheet title="체형 선택" onClose={close}>
          <SelectSheet
            options={weightTypeOptions.map((x) => x.name)}
            value={weightValue}
            onSelect={(name) => {
              const id = idByName(name, weightTypeOptions);
              if (id != null) onSetFashionBody("weightTypeTag", id);
              close();
            }}
          />
        </BottomSheet>
      ) : null}

      {sheet === "topSize" ? (
        <BottomSheet title="상의 사이즈 선택" onClose={close}>
          <SelectSheet
            options={topSizeOptions.map((x) => x.name)}
            value={topSizeValue}
            onSelect={(name) => {
              const id = idByName(name, topSizeOptions);
              if (id != null) onSetFashionBody("topSizeTag", id);
              close();
            }}
          />
        </BottomSheet>
      ) : null}
    </div>
  );
}
