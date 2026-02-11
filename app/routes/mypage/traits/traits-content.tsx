import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import NavigationHeader from "../../../components/common/NavigateHeader";
import { useHideHeader } from "../../../hooks/useHideHeader";
import { axiosInstance } from "../../../api/axios";
import { TRAITS } from "../components/profileCard/traitData";
import { tagName } from "../../../data/tagNameById";
import {
  useBeautyTags,
  useFashionTags,
  useContentTags,
} from "../../matching/test/_shared/tags/tags.query";
import type { TagItem } from "../../matching/test/_shared/tags/tags.types";

type FeatureResult = {
  beautyType?: {
    skinType?: number[] | null;
    skinBrightness?: number[] | null;
    makeupStyle?: number[] | null;
    interestCategories?: number[] | null;
    interestFunctions?: number[] | null;
  } | null;
  fashionType?: {
    height?: number[] | null;
    bodyShape?: number[] | null;
    topSize?: number[] | null;
    bottomSize?: number[] | null;
    interestFields?: number[] | null;
    interestStyles?: number[] | null;
    interestBrands?: number[] | null;
  } | null;
  contentsType?: {
    viewerGender?: number[] | null;
    viewerAge?: number[] | null;
    avgVideoLength?: number[] | null;
    avgViews?: number[] | null;
    contentFormats?: number[] | null;
    contentTones?: number[] | null;
    desiredInvolvement?: number[] | null;
    desiredUsageScope?: number[] | null;
  } | null;
};

type FeatureResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FeatureResult;
};

type CustomResponseVoid = {
  isSuccess: boolean;
  code: string;
  message: string;
  result?: unknown;
};

type TraitId = "beauty" | "fashion" | "content";

type EditSelections = {
  beauty: {
    "관심 카테고리": number[];
    "관심 기능": number[];
  };
  fashion: {
    "관심 스타일": number[];
    "관심 분야": number[];
    "관심 브랜드": number[];
  };
  content: {
    "콘텐츠 형식": number[];
    "콘텐츠 톤": number[];
    "희망 관여도": number[];
    "희망 활용 범위": number[];
  };
};

const pickCategory = (
  categories: Record<string, TagItem[]>,
  candidates: readonly string[],
): TagItem[] => {
  for (const key of candidates) {
    const v = categories[key];
    if (Array.isArray(v)) return v;
  }

  const normalize = (s: string) => s.replace(/\s+/g, "").trim();
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

const EMPTY_EDIT_SELECTIONS: EditSelections = {
  beauty: {
    "관심 카테고리": [],
    "관심 기능": [],
  },
  fashion: {
    "관심 스타일": [],
    "관심 분야": [],
    "관심 브랜드": [],
  },
  content: {
    "콘텐츠 형식": [],
    "콘텐츠 톤": [],
    "희망 관여도": [],
    "희망 활용 범위": [],
  },
};

const buildEditSelections = (
  feature: FeatureResult | null,
): EditSelections => ({
  beauty: {
    "관심 카테고리": feature?.beautyType?.interestCategories ?? [],
    "관심 기능": feature?.beautyType?.interestFunctions ?? [],
  },
  fashion: {
    "관심 스타일": feature?.fashionType?.interestStyles ?? [],
    "관심 분야": feature?.fashionType?.interestFields ?? [],
    "관심 브랜드": feature?.fashionType?.interestBrands ?? [],
  },
  content: {
    "콘텐츠 형식": feature?.contentsType?.contentFormats ?? [],
    "콘텐츠 톤": feature?.contentsType?.contentTones ?? [],
    "희망 관여도": feature?.contentsType?.desiredInvolvement ?? [],
    "희망 활용 범위": feature?.contentsType?.desiredUsageScope ?? [],
  },
});

const getSectionSelections = (
  selections: EditSelections,
  traitId: TraitId,
  sectionTitle: string,
): number[] => {
  return (selections[traitId] as Record<string, number[]>)[sectionTitle] ?? [];
};

const buildPatchPayload = (traitId: TraitId, selections: EditSelections) => {
  if (traitId === "beauty") {
    return {
      beauty: {
        interestStyleTags: selections.beauty["관심 카테고리"],
        prefferedFunctionTags: selections.beauty["관심 기능"],
      },
    };
  }

  if (traitId === "fashion") {
    return {
      fashion: {
        interestStyleTags: selections.fashion["관심 스타일"],
        preferredItemTags: selections.fashion["관심 분야"],
        preferredBrandTags: selections.fashion["관심 브랜드"],
      },
    };
  }

  return {
    content: {
      typeTags: selections.content["콘텐츠 형식"],
      toneTags: selections.content["콘텐츠 톤"],
      prefferedInvolvementTags: selections.content["희망 관여도"],
      prefferedCoverageTags: selections.content["희망 활용 범위"],
    },
  };
};

export default function TraitsPage() {
  useHideHeader(true);
  const navigate = useNavigate();
  const [feature, setFeature] = useState<FeatureResult | null>(null);
  const [editSelections, setEditSelections] = useState<EditSelections>(
    EMPTY_EDIT_SELECTIONS,
  );
  const [editingId, setEditingId] = useState<string | null>(null); // 수정 중인 섹션 ID
  const [isSaving, setIsSaving] = useState(false);
  const { data: beautyTags } = useBeautyTags();
  const { data: fashionTags } = useFashionTags();
  const { data: contentTags } = useContentTags();

  const tagNameById = useMemo(() => {
    const map = new Map<number, string>();
    const addItems = (items?: TagItem[]) => {
      (items ?? []).forEach((item) => {
        if (typeof item.id === "number" && item.name) {
          map.set(item.id, item.name);
        }
      });
    };
    const addCategories = (categories?: Record<string, TagItem[]>) => {
      Object.values(categories ?? {}).forEach(addItems);
    };

    addCategories(beautyTags?.categories);
    addCategories(fashionTags?.categories);

    addItems(contentTags?.viewerGenders);
    addItems(contentTags?.viewerAges);
    addItems(contentTags?.avgVideoLengths);
    addItems(contentTags?.avgVideoViews);
    addItems(contentTags?.formats);
    addItems(contentTags?.categories);
    addItems(contentTags?.tones);
    addItems(contentTags?.involvements);
    addItems(contentTags?.usageRanges);

    return map;
  }, [beautyTags, fashionTags, contentTags]);

  const tagOptions: Record<TraitId, Record<string, TagItem[]>> = useMemo(() => {
    const beautyCategories = beautyTags?.categories ?? {};
    const fashionCategories = fashionTags?.categories ?? {};

    return {
      beauty: {
        "관심 카테고리": pickCategory(beautyCategories, [
          "관심 카테고리",
          "관심 스타일",
        ]),
        "관심 기능": pickCategory(beautyCategories, ["관심 기능"]),
      },
      fashion: {
        "관심 분야": pickCategory(fashionCategories, [
          "관심 아이템/분야",
          "관심 분야",
          "관심 아이템",
          "아이템/분야",
          "아이템",
        ]),
        "관심 스타일": pickCategory(fashionCategories, [
          "관심 스타일",
          "패션 스타일",
          "스타일",
        ]),
        "관심 브랜드": pickCategory(fashionCategories, [
          "관심 브랜드",
          "관심 브랜드 종류",
          "선호 브랜드 종류",
          "브랜드 종류",
          "브랜드 타입",
          "브랜드",
        ]),
      },
      content: {
        "콘텐츠 형식": contentTags?.formats ?? [],
        "콘텐츠 톤": contentTags?.tones ?? [],
        "희망 관여도": contentTags?.involvements ?? [],
        "희망 활용 범위": contentTags?.usageRanges ?? [],
      },
    };
  }, [beautyTags, fashionTags, contentTags]);

  // 수정 버튼 클릭
  const handleEditClick = (id: string) => {
    setEditingId(id);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const featureRes = await axiosInstance.get<FeatureResponse>(
          "/api/v1/users/me/feature",
        );
        if (!isMounted) return;
        const nextFeature = featureRes.data?.isSuccess
          ? featureRes.data.result
          : null;
        setFeature(nextFeature);
        setEditSelections(buildEditSelections(nextFeature));
      } catch (error) {
        console.error("특성 조회 실패:", error);
        if (!isMounted) return;
        setFeature(null);
        setEditSelections(EMPTY_EDIT_SELECTIONS);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const traits = useMemo(() => {
    if (!feature) return TRAITS;

    const beauty = feature.beautyType;
    const fashion = feature.fashionType;
    const content = feature.contentsType;

    const names = (ids?: number[] | null) =>
      (ids ?? [])
        .map((id) => tagNameById.get(id) ?? tagName(id))
        .filter((value): value is string => Boolean(value));

    return TRAITS.map((trait) => {
      if (trait.id === "beauty") {
        return {
          ...trait,
          previewLines: [
            { label: "피부 타입", value: names(beauty?.skinType).join(", ") },
            {
              label: "피부 밝기",
              value: names(beauty?.skinBrightness).join(", "),
            },
            {
              label: "메이크업 \n스타일",
              value: names(beauty?.makeupStyle).join(", "),
            },
          ],
          topSummary: [
            { label: "피부타입", value: names(beauty?.skinType).join(", ") },
            {
              label: "피부 밝기",
              value: names(beauty?.skinBrightness).join(", "),
            },
            {
              label: "메이크업 스타일",
              value: names(beauty?.makeupStyle).join(", "),
            },
          ],
          sections: [
            {
              title: "관심 카테고리",
              items: names(beauty?.interestCategories),
            },
            {
              title: "관심 기능",
              items: names(beauty?.interestFunctions),
            },
          ],
        };
      }

      if (trait.id === "fashion") {
        return {
          ...trait,
          previewLines: [
            { label: "키", value: names(fashion?.height).join(", ") },
            {
              label: "체형 실루엣",
              value: names(fashion?.bodyShape).join(", "),
            },
            { label: "상의", value: names(fashion?.topSize).join(", ") },
            { label: "하의", value: names(fashion?.bottomSize).join(", ") },
          ],
          topSummary: [
            { label: "키/몸무게", value: names(fashion?.height).join(", ") },
            {
              label: "체형 실루엣",
              value: names(fashion?.bodyShape).join(", "),
            },
            { label: "상의 사이즈", value: names(fashion?.topSize).join(", ") },
            {
              label: "하의 사이즈",
              value: names(fashion?.bottomSize).join(", "),
            },
          ],
          sections: [
            {
              title: "관심 분야",
              items: names(fashion?.interestFields),
            },
            {
              title: "관심 스타일",
              items: names(fashion?.interestStyles),
            },
            {
              title: "관심 브랜드",
              items: names(fashion?.interestBrands),
            },
          ],
        };
      }

      if (trait.id === "content") {
        return {
          ...trait,
          previewLines: [
            {
              label: "주 시청자 성별",
              value: names(content?.viewerGender).join(", "),
            },
            {
              label: "주 시청자 나이대",
              value: names(content?.viewerAge).join(", "),
            },
            {
              label: "평균 영상 길이",
              value: names(content?.avgVideoLength).join(", "),
            },
            {
              label: "평균 조회수",
              value: names(content?.avgViews).join(", "),
            },
          ],
          topSummary: [
            {
              label: "주 시청자 성별",
              value: names(content?.viewerGender).join(", "),
            },
            {
              label: "주 시청자 나이대",
              value: names(content?.viewerAge).join(", "),
            },
            {
              label: "평균 영상 길이",
              value: names(content?.avgVideoLength).join(", "),
            },
            {
              label: "평균 조회수",
              value: names(content?.avgViews).join(", "),
            },
          ],
          sections: [
            {
              title: "콘텐츠 형식",
              items: names(content?.contentFormats),
            },
            {
              title: "콘텐츠 톤",
              items: names(content?.contentTones),
            },
            {
              title: "희망 관여도",
              items: names(content?.desiredInvolvement),
            },
            {
              title: "희망 활용 범위",
              items: names(content?.desiredUsageScope),
            },
          ],
        };
      }

      return trait;
    });
  }, [feature, tagNameById]);

  // 토글 버튼
  const handleTagToggle = (
    traitId: string,
    sectionTitle: string,
    valueId: number,
  ) => {
    if (
      traitId !== "beauty" &&
      traitId !== "fashion" &&
      traitId !== "content"
    ) {
      return;
    }

    if (!Number.isFinite(valueId)) {
      console.warn("유효하지 않은 태그 ID:", valueId);
      return;
    }

    setEditSelections((prev) => {
      const prevSection = getSectionSelections(prev, traitId, sectionTitle);
      const exists = prevSection.includes(valueId);
      const nextSection = exists
        ? prevSection.filter((id) => id !== valueId)
        : [...prevSection, valueId];

      return {
        ...prev,
        [traitId]: {
          ...(prev[traitId] as Record<string, number[]>),
          [sectionTitle]: nextSection,
        },
      };
    });
  };

  // 선택완료 버튼
  const handleComplete = async () => {
    if (!editingId) return;

    if (
      editingId !== "beauty" &&
      editingId !== "fashion" &&
      editingId !== "content"
    ) {
      setEditingId(null);
      return;
    }

    try {
      setIsSaving(true);
      const payload = buildPatchPayload(editingId, editSelections);
      const response = await axiosInstance.patch<CustomResponseVoid>(
        "/api/v1/users/me/feature",
        payload,
      );

      if (!response.data?.isSuccess) {
        throw new Error(response.data?.message || "특성 저장 실패");
      }

      setFeature((prev) => {
        const next: FeatureResult = {
          ...(prev ?? {}),
          beautyType: { ...(prev?.beautyType ?? {}) },
          fashionType: { ...(prev?.fashionType ?? {}) },
          contentsType: { ...(prev?.contentsType ?? {}) },
        };

        if (editingId === "beauty") {
          next.beautyType = {
            ...(prev?.beautyType ?? {}),
            interestCategories: editSelections.beauty["관심 카테고리"],
            interestFunctions: editSelections.beauty["관심 기능"],
          };
        }

        if (editingId === "fashion") {
          next.fashionType = {
            ...(prev?.fashionType ?? {}),
            interestStyles: editSelections.fashion["관심 스타일"],
            interestFields: editSelections.fashion["관심 분야"],
            interestBrands: editSelections.fashion["관심 브랜드"],
          };
        }

        if (editingId === "content") {
          next.contentsType = {
            ...(prev?.contentsType ?? {}),
            contentFormats: editSelections.content["콘텐츠 형식"],
            contentTones: editSelections.content["콘텐츠 톤"],
            desiredInvolvement: editSelections.content["희망 관여도"],
            desiredUsageScope: editSelections.content["희망 활용 범위"],
          };
        }

        return next;
      });

      setEditingId(null);
    } catch (error) {
      console.error("저장 실패:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen-full bg-[#404252]">
      <div className="w-full bg-white shadow-2xl flex flex-col">
        <div className="h-[60px]">
          <NavigationHeader title="내 특성" onBack={() => navigate(-1)} />
        </div>

        <div
          className="overflow-y-auto "
          style={{ height: `calc(100vh - 60px - 67px)` }}
        >
          <div className="px-4 py-4 space-y-6">
            {traits.map((trait) => {
              const cols = trait.topSummary.length;
              return (
                <section key={trait.id} className="space-y-3 bg-white">
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center justify-center">
                      {trait.icon("w-[46px] h-[47px]")}
                    </div>
                    <div className="text-title1 font-SemiBold text-[#4A4DFF]">
                      {trait.badge}
                    </div>
                    <button
                      type="button"
                      className="ml-1 text-[#9B9BA1] active:opacity-70"
                      onClick={() => handleEditClick(trait.id)}
                      aria-label="edit"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14.06 4.19 19.81 9.94"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="bg-[#F3F4F8] rounded-[13px] px-[6px] py-3">
                    <div
                      className={[
                        "grid",
                        cols === 3 ? "grid-cols-3" : "grid-cols-4",
                        "items-stretch",
                      ].join(" ")}
                    >
                      {trait.topSummary.map((item, i) => (
                        <div
                          key={i}
                          className={[
                            "text-center px-[1px]",
                            i === 0 ? "" : "border-l border-[#E8E8FB]",
                          ].join(" ")}
                        >
                          <div className="text-callout2 text-[#6666E5] font-SemiBold">
                            {item.label}
                          </div>
                          <div className="mt-1 text-callout1 text-[#5B5D6B] font-Pretendard">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="px-2 space-y-[10px]">
                    {trait.sections.map((section, i) => (
                      <div key={i}>
                        <div className="text-[12px] leading-[16px] font-medium text-[#6666E5]">
                          {section.title}
                        </div>

                        {editingId === trait.id ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {tagOptions[trait.id]?.[section.title]?.map(
                              (option) => {
                                const selectedIds = getSectionSelections(
                                  editSelections,
                                  trait.id,
                                  section.title,
                                );
                                const isSelected =
                                  typeof option.id === "number" &&
                                  selectedIds.includes(option.id);

                                return (
                                  <span
                                    key={option.id}
                                    onClick={() => {
                                      handleTagToggle(
                                        trait.id,
                                        section.title,
                                        option.id,
                                      );
                                    }}
                                    className={`px-[10px] py-1 border rounded-[20px] text-[14px] leading-[20px] font-medium cursor-pointer transition-colors
                                    ${
                                      isSelected
                                        ? "bg-[#B7B7F3B2] border-[#B7B7F3] text-[#6666E5]"
                                        : "bg-white border-[#E5E7EB] text-[#9B9BA1]"
                                    }`}
                                  >
                                    {option.name}
                                  </span>
                                );
                              },
                            )}
                          </div>
                        ) : (
                          <div className="mt-[2px] text-[12px] leading-[16px] font-medium text-[#404252]">
                            {section.items.join(", ")}
                          </div>
                        )}
                      </div>
                    ))}

                    {editingId === trait.id && (
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleComplete}
                          disabled={isSaving}
                          className="text-[14px] font-semibold text-[#6666E5]"
                        >
                          {isSaving ? "저장 중..." : "선택 완료"}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="h-[10px] bg-[#F3F3FA] -mx-4"></div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
