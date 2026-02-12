import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import Section from "./CommonSection";
import TraitCard from "./TraitCard";
import TraitModal from "./TraitModal";
import { TRAITS } from "./traitData";
import { tagName } from "../../../../data/tagNameById";
type FeatureData = {
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

type TraitsSectionProps = {
  feature?: FeatureData | null;
};

export default function TraitsSection({ feature }: TraitsSectionProps) {
  const navigate = useNavigate();
  const [selectedTrait, setSelectedTrait] = useState<(typeof TRAITS)[0] | null>(
    null,
  );
  const traits = useMemo(() => {
    if (!feature) return TRAITS;

    const beauty = feature.beautyType;
    const fashion = feature.fashionType;
    const content = feature.contentsType;

    const names = (ids?: number[] | null) =>
      (ids ?? [])
        .map((id) => tagName(id))
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
            { label: "체형", value: names(fashion?.bodyShape).join(", ") },
            { label: "상의", value: names(fashion?.topSize).join(", ") },
            { label: "하의", value: names(fashion?.bottomSize).join(", ") },
          ],
          topSummary: [
            { label: "키/몸무게", value: names(fashion?.height).join(", ") },
            { label: "체형", value: names(fashion?.bodyShape).join(", ") },
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
            { label: "성별", value: names(content?.viewerGender).join(", ") },
            { label: "나이대", value: names(content?.viewerAge).join(", ") },
            {
              label: "평균 길이",
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
              title: "브랜드 톤",
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
  }, [feature]);

  return (
    <>
      <Section
        title="내 특성"
        right={
          <button
            type="button"
            className="text-[20px] text-black/30"
            onClick={() => navigate("/mypage/traits")}
            aria-label="내 특성 보기"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="#9B9BA1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        }
      >
        <div className="overflow-x-auto overflow-y-visible snap-x snap-mandatory px-2 -my-4">
          <div className="flex py-4">
            {traits.map((trait) => (
              <div
                key={trait.id}
                className="min-w-[136px] shrink-0 snap-start p-1"
              >
                <TraitCard
                  trait={trait}
                  onClick={() => setSelectedTrait(trait)}
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {selectedTrait && (
        <TraitModal
          trait={selectedTrait}
          onClose={() => setSelectedTrait(null)}
        />
      )}
    </>
  );
}
