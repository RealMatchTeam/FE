import { create } from "zustand";

export type TagId = number | string;

// step1
export type SectionKey =
  | "style"
  | "function"
  | "skinType"
  | "skinTone"
  | "makeupStyle";
export type SelectedState = Record<SectionKey, TagId[]>;

const EMPTY_STEP1: SelectedState = {
  style: [],
  function: [],
  skinType: [],
  skinTone: [],
  makeupStyle: [],
};

// step2
export type Step2SectionKey = "fashionStyle" | "interestItem" | "brandType";
export type Step2SelectedState = Record<Step2SectionKey, TagId[]>;

const EMPTY_STEP2: Step2SelectedState = {
  fashionStyle: [],
  interestItem: [],
  brandType: [],
};

// step3(아직 태그 API에 없는 항목은 문자열 유지)
export type Step3SelectKey = "gender" | "ageGroup" | "videoLength" | "views";
export type Step3SelectedState = Record<Step3SelectKey, number[]>;

const EMPTY_STEP3_SELECTED: Step3SelectedState = {
  gender: [],
  ageGroup: [],
  videoLength: [],
  views: [],
};

// step3
export type Step3ChipKey =
  | "contentFormat"
  | "contentType"
  | "contentTone"
  | "contentHardness"
  | "editingRange";
export type Step3ChipsState = Record<Step3ChipKey, TagId[]>;

const EMPTY_STEP3_CHIPS: Step3ChipsState = {
  contentFormat: [],
  contentType: [],
  contentTone: [],
  contentHardness: [],
  editingRange: [],
};

type MatchingTestStore = {
  // step1
  selected: SelectedState;
  toggleStep1: (section: SectionKey, id: TagId, maxPerSection: number) => void;
  setSingleStep1: (section: SectionKey, id: TagId) => void;

  // step2
  step2Selected: Step2SelectedState;
  toggleStep2: (
    section: Step2SectionKey,
    id: TagId,
    maxPerSection: number,
  ) => void;

  heightCm: string;
  bodyShape: string;
  topSize: string;
  bottomSizeIn: string;

  setHeightCm: (v: string) => void;
  setBodyShape: (v: string) => void;
  setTopSize: (v: string) => void;
  setBottomSizeIn: (v: string) => void;

  // step3
  snsUrl: string;
  setSnsUrl: (v: string) => void;
  isValidInstagramUrl: () => boolean;

  step3Selected: Step3SelectedState;
  toggleStep3Select: (key: Step3SelectKey, id: number, max: number) => void;

  step3Chips: Step3ChipsState;
  toggleStep3Chip: (key: Step3ChipKey, id: TagId, max: number) => void;

  resetAll: () => void;
};

export const useMatchingTestStore = create<MatchingTestStore>((set, get) => ({
  // step1
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

  // step1 단일 선택(피부타입/톤/메이크업스타일 같은 것)
  setSingleStep1: (section, id) => {
    const prev = get().selected;
    set({ selected: { ...prev, [section]: [id] } });
  },

  // step2
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

  heightCm: "",
  bodyShape: "",
  topSize: "",
  bottomSizeIn: "",

  setHeightCm: (v) => set({ heightCm: v }),
  setBodyShape: (v) => set({ bodyShape: v }),
  setTopSize: (v) => set({ topSize: v }),
  setBottomSizeIn: (v) => set({ bottomSizeIn: v }),

  // step3
  snsUrl: "",
  setSnsUrl: (v) => set({ snsUrl: v }),
  isValidInstagramUrl: () => get().snsUrl.startsWith("www.instagram/"),

  step3Selected: EMPTY_STEP3_SELECTED,
  toggleStep3Select: (key, label, max) => {
    const prevAll = get().step3Selected;
    const cur = prevAll[key];
    const already = cur.includes(label);

    if (already) {
      set({
        step3Selected: { ...prevAll, [key]: cur.filter((x) => x !== label) },
      });
      return;
    }
    if (cur.length >= max) return;

    set({ step3Selected: { ...prevAll, [key]: [...cur, label] } });
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
      heightCm: "",
      bodyShape: "",
      topSize: "",
      bottomSizeIn: "",
      snsUrl: "",
      step3Selected: EMPTY_STEP3_SELECTED,
      step3Chips: EMPTY_STEP3_CHIPS,
    }),
}));
