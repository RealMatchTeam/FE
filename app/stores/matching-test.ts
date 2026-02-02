import { create } from "zustand";

export type SectionKey =
  | "style"
  | "function"
  | "skinType"
  | "skinTone"
  | "makeupStyle";

export type Step2SectionKey = "fashionStyle" | "interestItem" | "brandType";

export type Step3SelectKey = "gender" | "ageGroup" | "videoLength" | "views";

export type Step3ChipKey =
  | "contentFormat"
  | "contentType"
  | "contentTone"
  | "contentHardness"
  | "editingRange";

export type SelectedState = Record<SectionKey, number[]>;
export type Step2SelectedState = Record<Step2SectionKey, number[]>;
export type Step3SelectedState = Record<Step3SelectKey, number[]>;
export type Step3ChipsState = Record<Step3ChipKey, number[]>;

const EMPTY_STEP1: SelectedState = {
  style: [],
  function: [],
  skinType: [],
  skinTone: [],
  makeupStyle: [],
};

const EMPTY_STEP2: Step2SelectedState = {
  fashionStyle: [],
  interestItem: [],
  brandType: [],
};

const EMPTY_STEP3_SELECTED: Step3SelectedState = {
  gender: [],
  ageGroup: [],
  videoLength: [],
  views: [],
};

const EMPTY_STEP3_CHIPS: Step3ChipsState = {
  contentFormat: [],
  contentType: [],
  contentTone: [],
  contentHardness: [],
  editingRange: [],
};

export type FashionBodyTags = {
  heightTag: number | null;
  weightTypeTag: number | null;
  topSizeTag: number | null;
  bottomSizeTag: number | null;
};

const EMPTY_FASHION_BODY: FashionBodyTags = {
  heightTag: null,
  weightTypeTag: null,
  topSizeTag: null,
  bottomSizeTag: null,
};

type MatchingTestStore = {
  selected: SelectedState;
  toggleStep1: (section: SectionKey, id: number, maxPerSection: number) => void;
  setSingleStep1: (section: SectionKey, id: number) => void;

  step2Selected: Step2SelectedState;
  toggleStep2: (
    section: Step2SectionKey,
    id: number,
    maxPerSection: number,
  ) => void;

  fashionBody: FashionBodyTags;
  setFashionBody: (key: keyof FashionBodyTags, id: number | null) => void;

  snsUrl: string;
  setSnsUrl: (v: string) => void;
  isValidInstagramUrl: () => boolean;

  step3Selected: Step3SelectedState;
  toggleStep3Select: (key: Step3SelectKey, id: number, max: number) => void;

  step3Chips: Step3ChipsState;
  toggleStep3Chip: (key: Step3ChipKey, id: number, max: number) => void;

  resetAll: () => void;
};

export const useMatchingTestStore = create<MatchingTestStore>((set, get) => ({
  selected: EMPTY_STEP1,

  toggleStep1: (section, id, maxPerSection) => {
    const prev = get().selected;
    const cur = prev[section];
    const already = cur.includes(id);

    if (already) {
      set({ selected: { ...prev, [section]: cur.filter((x) => x !== id) } });
      return;
    }
    if (cur.length >= maxPerSection) return;

    set({ selected: { ...prev, [section]: [...cur, id] } });
  },

  setSingleStep1: (section, id) => {
    const prev = get().selected;
    set({ selected: { ...prev, [section]: [id] } });
  },

  step2Selected: EMPTY_STEP2,
  toggleStep2: (section, id, maxPerSection) => {
    const prev = get().step2Selected;
    const cur = prev[section];
    const already = cur.includes(id);

    if (already) {
      set({
        step2Selected: { ...prev, [section]: cur.filter((x) => x !== id) },
      });
      return;
    }
    if (cur.length >= maxPerSection) return;

    set({ step2Selected: { ...prev, [section]: [...cur, id] } });
  },

  fashionBody: EMPTY_FASHION_BODY,
  setFashionBody: (key, id) => {
    const prev = get().fashionBody;
    set({ fashionBody: { ...prev, [key]: id } });
  },

  snsUrl: "",
  setSnsUrl: (v) => set({ snsUrl: v }),
  isValidInstagramUrl: () =>
    /^https?:\/\/(www\.)?instagram\.com\/.+/i.test(get().snsUrl.trim()),

  step3Selected: EMPTY_STEP3_SELECTED,
  toggleStep3Select: (key, id, max) => {
    const prevAll = get().step3Selected;
    const cur = prevAll[key];
    const already = cur.includes(id);

    if (already) {
      set({
        step3Selected: { ...prevAll, [key]: cur.filter((x) => x !== id) },
      });
      return;
    }
    if (cur.length >= max) return;

    set({ step3Selected: { ...prevAll, [key]: [...cur, id] } });
  },

  step3Chips: EMPTY_STEP3_CHIPS,
  toggleStep3Chip: (key, id, max) => {
    const prevAll = get().step3Chips;
    const cur = prevAll[key];
    const already = cur.includes(id);

    if (already) {
      set({ step3Chips: { ...prevAll, [key]: cur.filter((x) => x !== id) } });
      return;
    }
    if (cur.length >= max) return;

    set({ step3Chips: { ...prevAll, [key]: [...cur, id] } });
  },

  resetAll: () =>
    set({
      selected: EMPTY_STEP1,
      step2Selected: EMPTY_STEP2,
      fashionBody: EMPTY_FASHION_BODY,
      snsUrl: "",
      step3Selected: EMPTY_STEP3_SELECTED,
      step3Chips: EMPTY_STEP3_CHIPS,
    }),
}));
