import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import NavigationHeader from "../../../components/common/NavigateHeader";
import { useHideHeader } from "../../../hooks/useHideHeader";
import { axiosInstance } from "../../../api/axios";
import { TRAITS } from "../components/profileCard/traitData";
import { tagName } from "../../../constants/tagNameById";

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

export default function TraitsPage() {
  useHideHeader(true);
  const navigate = useNavigate();
  const [feature, setFeature] = useState<FeatureResult | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const featureRes = await axiosInstance.get<FeatureResponse>(
          "/api/v1/users/me/feature",
        );
        if (!isMounted) return;
        setFeature(featureRes.data?.isSuccess ? featureRes.data.result : null);
      } catch (error) {
        console.error("특성 조회 실패:", error);
        if (!isMounted) return;
        setFeature(null);
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
        .map((id) => tagName(id))
        .filter((value): value is string => Boolean(value));

    return TRAITS.map((trait) => {
      if (trait.id === "beauty") {
        return {
          ...trait,
          previewLines: [
            { label: "피부 타입", value: names(beauty?.skinType).join(", ") },
            { label: "피부 밝기", value: names(beauty?.skinBrightness).join(", ") },
            {
              label: "메이크업 \n스타일",
              value: names(beauty?.makeupStyle).join(", "),
            },
          ],
          topSummary: [
            { label: "피부타입", value: names(beauty?.skinType).join(", ") },
            { label: "피부 밝기", value: names(beauty?.skinBrightness).join(", ") },
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
            { label: "하의 사이즈", value: names(fashion?.bottomSize).join(", ") },
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
            { label: "평균 조회수", value: names(content?.avgViews).join(", ") },
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
            { label: "평균 조회수", value: names(content?.avgViews).join(", ") },
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
    <div className="h-screen-full bg-[#404252]">
      <div className="w-full max-w-[430px] bg-white shadow-2xl flex flex-col">
        <div className="h-[60px]">
          <NavigationHeader title="내 특성" onBack={() => navigate(-1)} />
        </div>

        <div
          className="overflow-y-auto "
          style={{ height: `calc(100vh - 60px)` }}
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

                  <div className="space-y-[10px]">
                    {trait.sections.map((section, i) => (
                      <div key={i}>
                        <div className="text-callout1 font-Medium text-[#6666E5]">
                          {section.title}
                        </div>
                        <div className="text-callout1 font-Medium text-[#404252]">
                          {section.items.join(", ")}
                        </div>
                      </div>
                    ))}
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
