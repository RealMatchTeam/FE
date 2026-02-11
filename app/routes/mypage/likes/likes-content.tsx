import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import NavigationHeader from "../../../components/common/NavigateHeader";
import { useHideHeader } from "../../../hooks/useHideHeader";
import FilterBottomSheet from "../../business/components/FilterBottomSheet";
import FilterButton from "../../../components/common/FilterButton";
import { axiosInstance } from "../../../api/axios";

type BrandLike = {
  id: number;
  name: string;
  tags: string[];
  matchRate: number;
  isLiked: boolean;
  logoUrl?: string | null;
};

type BrandScrap = {
  brandId: number;
  brandName: string;
  brandLogo?: string | null;
  matchingRate: number;
  hashtags: string[];
  isScraped: boolean;
};

type CampaignScrap = {
  campaignId: number;
  brandName: string;
  campaignTitle: string;
  brandLogo?: string | null;
  matchingRate: number;
  reward: number;
  dDay: number;
  currentApplicants: number;
  totalRecruits: number;
  isScraped: boolean;
};

type MyScrapResponseDto = {
  type: string;
  totalCount: number;
  brandList?: BrandScrap[];
  campaignList?: CampaignScrap[];
};

type CustomResponseMyScrapResponseDto = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MyScrapResponseDto;
};

type CampaignLike = {
  id: number;
  brand: string;
  title: string;
  matchRate: number;
  reward: number;
  dday: string;
  applicants: string;
  isLiked: boolean;
  logoUrl?: string | null;
};

const SORT_PARAM_MAP: Record<string, string> = {
  "정렬 필터": "matchingRate",
  "매칭률 순": "matchingRate",
  "인기 순": "popularity",
  "신규 순": "latest",
  "금액 순": "reward",
  "마감 순": "dDay",
};

export default function MyPageLikes() {
  useHideHeader(true);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"brand" | "campaign">("brand");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState("매칭률 순");
  const [loading, setLoading] = useState(false);
  const [brandLikesApi, setBrandLikesApi] = useState<BrandLike[]>([]);
  const [campaignLikesApi, setCampaignLikesApi] = useState<CampaignLike[]>([]);

  const getSortButtonLabel = () => sortOption;

  const brandLikes = useMemo(() => {
    const base = brandLikesApi;
    const list = [...base];
    if (sortOption === "매칭률 순") {
      return list.sort((a, b) => b.matchRate - a.matchRate);
    }
    if (sortOption === "인기 순") {
      return list.sort((a, b) => b.matchRate - a.matchRate);
    }
    if (sortOption === "신규 순") {
      return list.sort((a, b) => b.id - a.id);
    }
    return list;
  }, [sortOption, brandLikesApi]);

  const campaignLikes = useMemo(() => {
    const base = campaignLikesApi;
    const list = [...base];
    if (sortOption === "매칭률 순") {
      return list.sort((a, b) => b.matchRate - a.matchRate);
    }
    if (sortOption === "인기 순") {
      return list.sort((a, b) => b.matchRate - a.matchRate);
    }
    if (sortOption === "금액 순") {
      return list.sort((a, b) => b.reward - a.reward);
    }
    if (sortOption === "마감 순") {
      return list.sort((a, b) => a.id - b.id);
    }
    return list;
  }, [sortOption, campaignLikesApi]);

  useEffect(() => {
    let isMounted = true;
    const fetchScrap = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get<CustomResponseMyScrapResponseDto>(
          "/api/v1/users/me/scrap",
          {
            params: {
              type: activeTab === "brand" ? "brand" : "campaign",
              sort: SORT_PARAM_MAP[sortOption] ?? "matchingRate",
            },
          },
        );
        if (!isMounted) return;
        if (!res.data?.isSuccess) {
          throw new Error(res.data?.message || "찜 목록 조회 실패");
        }
        const result = res.data.result;
        if (activeTab === "brand") {
          const mapped =
            result.brandList?.map((b) => ({
              id: b.brandId,
              name: b.brandName,
              tags: b.hashtags ?? [],
              matchRate: b.matchingRate ?? 0,
              isLiked: Boolean(b.isScraped),
              logoUrl: b.brandLogo ?? null,
            })) ?? [];
          setBrandLikesApi(mapped);
        } else {
          const mapped =
            result.campaignList?.map((c) => ({
              id: c.campaignId,
              brand: c.brandName,
              title: c.campaignTitle,
              matchRate: c.matchingRate ?? 0,
              reward: c.reward ?? 0,
              dday: c.dDay === 0 ? "D-Day" : `D-${c.dDay}`,
              applicants: `${c.currentApplicants}/${c.totalRecruits}명`,
              isLiked: Boolean(c.isScraped),
              logoUrl: c.brandLogo ?? null,
            })) ?? [];
          setCampaignLikesApi(mapped);
        }
      } catch (error) {
        console.error("찜 목록 조회 실패:", error);
        if (!isMounted) return;
        if (activeTab === "brand") setBrandLikesApi([]);
        if (activeTab === "campaign") setCampaignLikesApi([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchScrap();
    return () => {
      isMounted = false;
    };
  }, [activeTab, sortOption]);

  const toggleBrandLike = async (brandId: number) => {
    setBrandLikesApi((prev) =>
      prev.map((b) => (b.id === brandId ? { ...b, isLiked: !b.isLiked } : b)),
    );
    try {
      await axiosInstance.post(`/api/v1/brands/${brandId}/like`);
    } catch (error) {
      console.error("브랜드 좋아요 토글 실패:", error);
      setBrandLikesApi((prev) =>
        prev.map((b) => (b.id === brandId ? { ...b, isLiked: !b.isLiked } : b)),
      );
    }
  };

  const toggleCampaignLike = async (campaignId: number) => {
    setCampaignLikesApi((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, isLiked: !c.isLiked } : c)),
    );
    try {
      await axiosInstance.post(`/api/v1/campaigns/${campaignId}/like`);
    } catch (error) {
      console.error("캠페인 좋아요 토글 실패:", error);
      setCampaignLikesApi((prev) =>
        prev.map((c) => (c.id === campaignId ? { ...c, isLiked: !c.isLiked } : c)),
      );
    }
  };

  return (
    <div className="h-screen-full bg-gradient-to-b from-[#F6F6FF] via-[#F3F3FA] to-[#E8E8FB]">
      <div className="w-full shadow-2xl flex flex-col">
        <div className="h-[60px]">
          <NavigationHeader title="내 찜" onBack={() => navigate(-1)} />
        </div>

        <div className="bg-white border-b border-[#E8E8FB]">
          <div className="flex">
            <button
              type="button"
              onClick={() => setActiveTab("brand")}
              className={[
                "flex-1 py-4 text-[16px] font-medium",
                activeTab === "brand"
                  ? "text-[#6666E5] border-b-2 border-[#6666E5]"
                  : "text-[#9B9BA1]",
              ].join(" ")}
            >
              찜한 브랜드
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("campaign")}
              className={[
                "flex-1 py-4 text-[16px] font-medium",
                activeTab === "campaign"
                  ? "text-[#6666E5] border-b-2 border-[#6666E5]"
                  : "text-[#9B9BA1]",
              ].join(" ")}
            >
              찜한 캠페인
            </button>
          </div>
        </div>

        <div
          className="overflow-y-auto"
          style={{ height: `calc(100vh - 60px - 67px - 59px)` }}
        >
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="text-[16px] leading-[20px] font-semibold text-black">
                {activeTab === "brand" ? "브랜드 리스트" : "캠페인 리스트"}
              </div>
              <FilterButton
                label={getSortButtonLabel()}
                isActive={sortOption !== "정렬 필터"}
                onClick={() => {
                  setIsFilterOpen(true);
                }}
              />
            </div>

            {loading ? (
              <div className="py-10 text-center text-[#9B9BA1] text-[14px]">
                로딩 중...
              </div>
            ) : (
            <div className="mt-4 space-y-4">
              {activeTab === "brand"
                ? brandLikes.length > 0
                  ? brandLikes.map((brand) => (
                    <div
                      key={brand.id}
                      className="bg-white rounded-[14px] border border-[#E8E8FB] px-[10px] py-[10px] flex gap-4 items-center h-[100px]"
                    >
                      <div className="w-[80px] h-[80px] rounded-[12px] border border-[#E8E8FB] grid place-items-center text-[#1D1D1F] text-[16px] font-semibold whitespace-pre text-center">
                        {brand.logoUrl ? (
                          <img
                            src={brand.logoUrl}
                            alt={brand.name}
                            className="w-full h-full object-contain rounded-[10px]"
                          />
                        ) : (
                          brand.name
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-[18px] font-semibold text-[#171718] truncate">
                            {brand.name}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="text-[#6D6AFE] text-[14px] font-semibold">
                              매칭률 {brand.matchRate}%
                            </div>
                            <button
                              type="button"
                              className="text-[#B7B7F3] text-[24px]"
                              aria-label="찜 해제"
                              onClick={() => toggleBrandLike(brand.id)}
                            >
                              {brand.isLiked ? "♥" : "♡"}
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 text-[13px] text-[#8B8D99] truncate">
                          {brand.tags.join(" ")}
                        </div>
                      </div>
                    </div>
                  ))
                  : (
                    <div className="py-12 text-center text-[#9B9BA1] text-[14px]">
                      찜한 브랜드가 없습니다.
                    </div>
                  )
                : campaignLikes.length > 0
                  ? campaignLikes.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="bg-white rounded-[10px] border border-[#E8E8FB] px-[10px] pt-[10px] pb-[6px] flex gap-4 items-start"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-[80px] h-[80px] rounded-[5px] border border-[#E6E6F3] grid place-items-center text-[#1D1D1F] text-[16px] font-semibold whitespace-pre text-center">
                          {campaign.logoUrl ? (
                            <img
                              src={campaign.logoUrl}
                              alt={campaign.brand}
                              className="w-full h-full object-contain rounded-[10px]"
                            />
                          ) : (
                            campaign.brand
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="px-[2px] py-[1px] rounded-[5px] border border-[#6666E5] text-[#6666E5] text-[10px] leading-[14px]">
                            {campaign.dday}
                          </span>
                          <span className="px-[2px] py-[2px] rounded-[5px] bg-[#E6E6F3] text-[#6666E5] text-[10px] leading-[14px]">
                            {campaign.applicants}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 py-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-[16px] leading-[20px] font-semibold text-[#171718] truncate">
                            {campaign.brand}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="text-[#6D6AFE] text-[12px] leading-[16px] font-medium">
                              매칭률 {campaign.matchRate}%
                            </div>
                            <button
                              type="button"
                              className="text-[#B7B7F3] text-[24px] leading-none"
                              aria-label="찜 해제"
                              onClick={() => toggleCampaignLike(campaign.id)}
                            >
                              {campaign.isLiked ? "♥" : "♡"}
                            </button>
                          </div>
                        </div>
                        <div className="mt-[2px] text-[14px] leading-[20px] font-medium text-[#171718] truncate">
                          {campaign.title}
                        </div>
                        <div className="text-[11px] leading-[16px] text-[#6666E5] font-medium">
                          원고료: {campaign.reward.toLocaleString()}원
                        </div>
                      </div>
                    </div>
                  ))
                  : (
                    <div className="py-12 text-center text-[#9B9BA1] text-[14px]">
                      찜한 캠페인이 없습니다.
                    </div>
                  )}
            </div>
            )}
          </div>
        </div>

        <FilterBottomSheet
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={(filter) => setSortOption(filter)}
          currentFilter={sortOption}
          filters={
            activeTab === "brand"
              ? ["매칭률 순", "인기 순", "신규 순"]
              : ["매칭률 순", "인기 순", "금액 순", "마감 순"]
          }
          title="정렬 필터"
        />
      </div>
    </div>
  );
}
