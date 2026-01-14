import { create } from "zustand";

/* ======================================================
 * STEP 1
 * ====================================================== */
export type SectionKey = "style" | "function" | "skinType" | "skinTone" | "makeupStyle";
export type SelectedState = Record<SectionKey, string[]>;

const EMPTY_STEP1: SelectedState = {
  style: [],
  function: [],
  skinType: [],
  skinTone: [],
  makeupStyle: [],
};

/* ======================================================
 * STEP 2
 * ====================================================== */
export type Step2SectionKey = "fashionStyle" | "interestItem" | "brandType";
export type Step2SelectedState = Record<Step2SectionKey, string[]>;

const EMPTY_STEP2: Step2SelectedState = {
  fashionStyle: [],
  interestItem: [],
  brandType: [],
};

/* ======================================================
 * STEP 3
 * ====================================================== */
export type Step3SelectKey = "gender" | "ageGroup" | "videoLength" | "views";
export type Step3SelectedState = Record<Step3SelectKey, string[]>;

const EMPTY_STEP3_SELECTED: Step3SelectedState = {
  gender: [],
  ageGroup: [],
  videoLength: [],
  views: [],
};

export type Step3ChipKey =
  | "contentFormat"
  | "contentType"
  | "contentTone"
  | "contentHardness"
  | "editingRange";

export type Step3ChipsState = Record<Step3ChipKey, string[]>;

const EMPTY_STEP3_CHIPS: Step3ChipsState = {
  contentFormat: [],
  contentType: [],
  contentTone: [],
  contentHardness: [],
  editingRange: [],
};

/* ======================================================
 * STORE
 * ====================================================== */
type MatchingTestStore = {
  // step1
  selected: SelectedState;
  toggleStep1: (section: SectionKey, label: string, maxPerSection: number) => void;

  // step2
  step2Selected: Step2SelectedState;
  toggleStep2: (section: Step2SectionKey, label: string, maxPerSection: number) => void;

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
  toggleStep3Select: (key: Step3SelectKey, label: string, max: number) => void;

  // ✅ 추가: 단일 선택(성별/나이대 같은 라디오용)
  setSingleStep3Select: (key: Step3SelectKey, label: string) => void;

  step3Chips: Step3ChipsState;
  toggleStep3Chip: (key: Step3ChipKey, label: string, max: number) => void;

  resetAll: () => void;
};

export const useMatchingTestStore = create<MatchingTestStore>((set, get) => ({
  /* ---------- step1 ---------- */
  selected: EMPTY_STEP1,
  toggleStep1: (section, label, maxPerSection) => {
    const prev = get().selected;
    const cur = prev[section];
    const already = cur.includes(label);

    if (already) {
      set({ selected: { ...prev, [section]: cur.filter((x) => x !== label) } });
      return;
    }
    if (cur.length >= maxPerSection) return;

    set({ selected: { ...prev, [section]: [...cur, label] } });
  },

  /* ---------- step2 ---------- */
  step2Selected: EMPTY_STEP2,
  toggleStep2: (section, label, maxPerSection) => {
    const prev = get().step2Selected;
    const cur = prev[section];
    const already = cur.includes(label);

    if (already) {
      set({ step2Selected: { ...prev, [section]: cur.filter((x) => x !== label) } });
      return;
    }
    if (cur.length >= maxPerSection) return;

    set({ step2Selected: { ...prev, [section]: [...cur, label] } });
  },

  heightCm: "",
  bodyShape: "",
  topSize: "",
  bottomSizeIn: "",

  setHeightCm: (v) => set({ heightCm: v }),
  setBodyShape: (v) => set({ bodyShape: v }),
  setTopSize: (v) => set({ topSize: v }),
  setBottomSizeIn: (v) => set({ bottomSizeIn: v }),

  /* ---------- step3 ---------- */
  snsUrl: "",
  setSnsUrl: (v) => set({ snsUrl: v }),
  isValidInstagramUrl: () => get().snsUrl.startsWith("www.instagram/"),

  step3Selected: EMPTY_STEP3_SELECTED,

  toggleStep3Select: (key, label, max) => {
    const prevAll = get().step3Selected;
    const cur = prevAll[key];
    const already = cur.includes(label);

    if (already) {
      set({ step3Selected: { ...prevAll, [key]: cur.filter((x) => x !== label) } });
      return;
    }
    if (cur.length >= max) return;

    set({ step3Selected: { ...prevAll, [key]: [...cur, label] } });
  },

  // ✅ 단일 선택(라디오): 무조건 하나만 유지
  setSingleStep3Select: (key, label) => {
    const prevAll = get().step3Selected;
    set({ step3Selected: { ...prevAll, [key]: [label] } });
  },

  step3Chips: EMPTY_STEP3_CHIPS,
  toggleStep3Chip: (key, label, max) => {
    const prevAll = get().step3Chips;
    const cur = prevAll[key];
    const already = cur.includes(label);

    if (already) {
      set({ step3Chips: { ...prevAll, [key]: cur.filter((x) => x !== label) } });
      return;
    }
    if (cur.length >= max) return;

    set({ step3Chips: { ...prevAll, [key]: [...cur, label] } });
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
