import { useMemo, useState } from "react";
import Section from "./CommonSection";
import TraitCard from "./TraitCard";
import TraitModal from "./TraitModal";
import { TRAITS } from "./traitData"; 
type FeatureData = {
  beautyType?: {
    skinType?: string[] | null;
    skinBrightness?: string | null;
    makeupStyle?: string[] | null;
    interestCategories?: string[] | null;
    interestFunctions?: string[] | null;
  } | null;
  fashionType?: {
    height?: string | null;
    bodyShape?: string | null;
    topSize?: string | null;
    bottomSize?: string | null;
    interestFields?: string[] | null;
    interestStyles?: string[] | null;
    interestBrands?: string[] | null;
  } | null;
  contentsType?: {
    viewerGender?: string[] | null;
    viewerAge?: string[] | null;
    avgVideoLength?: string | null;
    avgViews?: string | null;
    contentFormats?: string[] | null;
    contentTones?: string[] | null;
    desiredInvolvement?: string[] | null;
    desiredUsageScope?: string[] | null;
  } | null;
};

type TraitsSectionProps = {
  feature?: FeatureData | null;
};

export default function TraitsSection({ feature }: TraitsSectionProps) {
  const [selectedTrait, setSelectedTrait] = useState<typeof TRAITS[0] | null>(null);
  const traits = useMemo(() => {
    if (!feature) return TRAITS;

    const beauty = feature.beautyType;
    const fashion = feature.fashionType;
    const content = feature.contentsType;

    return TRAITS.map((trait) => {
      if (trait.id === "beauty") {
        return {
          ...trait,
          previewLines: [
            { label: "피부 타입", value: (beauty?.skinType ?? []).join(", ") },
            { label: "피부 밝기", value: beauty?.skinBrightness ?? "" },
            { label: "메이크업 \n스타일", value: (beauty?.makeupStyle ?? []).join(", ") },
          ],
          topSummary: [
            { label: "피부타입", value: (beauty?.skinType ?? []).join(", ") },
            { label: "피부 밝기", value: beauty?.skinBrightness ?? "" },
            { label: "메이크업 스타일", value: (beauty?.makeupStyle ?? []).join(", ") },
          ],
          sections: [
            {
              title: "관심 카테고리",
              items: beauty?.interestCategories ?? [],
            },
            {
              title: "관심 기능",
              items: beauty?.interestFunctions ?? [],
            },
          ],
        };
      }

      if (trait.id === "fashion") {
        return {
          ...trait,
          previewLines: [
            { label: "키", value: fashion?.height ?? "" },
            { label: "체형", value: fashion?.bodyShape ?? "" },
            { label: "상의", value: fashion?.topSize ?? "" },
            { label: "하의", value: fashion?.bottomSize ?? "" },
          ],
          topSummary: [
            { label: "키/몸무게", value: fashion?.height ?? "" },
            { label: "체형", value: fashion?.bodyShape ?? "" },
            { label: "상의 사이즈", value: fashion?.topSize ?? "" },
            { label: "하의 사이즈", value: fashion?.bottomSize ?? "" },
          ],
          sections: [
            {
              title: "관심 분야",
              items: fashion?.interestFields ?? [],
            },
            {
              title: "관심 스타일",
              items: fashion?.interestStyles ?? [],
            },
            {
              title: "관심 브랜드",
              items: fashion?.interestBrands ?? [],
            },
          ],
        };
      }

      if (trait.id === "content") {
        return {
          ...trait,
          previewLines: [
            { label: "성별", value: (content?.viewerGender ?? []).join(", ") },
            { label: "나이대", value: (content?.viewerAge ?? []).join(", ") },
            { label: "평균 길이", value: content?.avgVideoLength ?? "" },
            { label: "평균 조회수", value: content?.avgViews ?? "" },
          ],
          topSummary: [
            { label: "주 시청자 성별", value: (content?.viewerGender ?? []).join(", ") },
            { label: "주 시청자 나이대", value: (content?.viewerAge ?? []).join(", ") },
            { label: "평균 영상 길이", value: content?.avgVideoLength ?? "" },
            { label: "평균 조회수", value: content?.avgViews ?? "" },
          ],
          sections: [
            {
              title: "콘텐츠 형식",
              items: content?.contentFormats ?? [],
            },
            {
              title: "브랜드 톤",
              items: content?.contentTones ?? [],
            },
            {
              title: "희망 관여도",
              items: content?.desiredInvolvement ?? [],
            },
            {
              title: "희망 활용 범위",
              items: content?.desiredUsageScope ?? [],
            },
          ],
        };
      }

      return trait;
    });
  }, [feature]);

  return (
    <>
      <Section
        title="내 특성"
        right={
          <button type="button" className="text-[20px] text-black/30">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="#9B9BA1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        }
      >
        <div className="overflow-x-auto snap-x snap-mandatory">
          <div className="flex px-2 py-2 gap-2">
            {traits.map((trait) => (
              <div key={trait.id} className="min-w-[136px] shrink-0 snap-start">
                <TraitCard trait={trait} onClick={() => setSelectedTrait(trait)} />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {selectedTrait && (
        <TraitModal trait={selectedTrait} onClose={() => setSelectedTrait(null)} />
      )}
    </>
  );
}
