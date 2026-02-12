import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import NavigationHeader from "../../../components/common/NavigateHeader";
import { useHideHeader } from "../../../hooks/useHideHeader";
import { useHideBottomTab } from "../../../hooks/useHideBottomTab";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { axiosInstance } from "../../../api/axios";
import SortFilterSheet from "../../chat/components/ChatSortFilterSheet";

type BrandLike = {
  id: number;
  name: string;
  tags: string[];
  matchRate: number;
  likeCount: number;
  isLiked: boolean;
  logoUrl?: string | null;
};

type FavoriteBrandDto = {
  brandId: number;
  brandName: string;
  brandLogoUrl?: string | null;
  matchingRatio: number;
  likeCount: number;
  tags: string[];
};

type FavoriteBrandListResponseDto = {
  count: number;
  brands: FavoriteBrandDto[];
};

type CustomResponseFavoriteBrandListResponseDto = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteBrandListResponseDto;
};

type CampaignLike = {
  id: number;
  brand: string;
  title: string;
  matchRate: number;
  likeCount: number;
  reward: number;
  dday: string;
  ddayValue: number;
  applicants: string;
  isLiked: boolean;
  logoUrl?: string | null;
};

type FavoriteCampaignDto = {
  campaignId: number;
  brandName: string;
  campaignTitle: string;
  brandLogoUrl?: string | null;
  matchingRatio: number;
  likeCount: number;
  rewardAmount: number;
  quota: number;
  dday: number;
};

type FavoriteCampaignListResponseDto = {
  count: number;
  campaigns: FavoriteCampaignDto[];
};

type CustomResponseFavoriteCampaignListResponseDto = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteCampaignListResponseDto;
};

const BRAND_SORT_PARAM_MAP: Record<string, string> = {
  "정렬 필터": "MATCH_SCORE",
  "매칭률 순": "MATCH_SCORE",
  "인기 순": "POPULARITY",
  "신규 순": "NEWEST",
};

const CAMPAIGN_SORT_PARAM_MAP: Record<string, string> = {
  "정렬 필터": "MATCH_SCORE",
  "매칭률 순": "MATCH_SCORE",
  "인기 순": "POPULARITY",
  "금액 순": "REWARD_AMOUNT",
  "마감 순": "D_DAY",
};

export default function MyPageLikes() {
  useHideHeader(true);
  const navigate = useNavigate();
  const DEFAULT_SORT_LABEL = "매칭률 순";
  const [activeTab, setActiveTab] = useState<"brand" | "campaign">("brand");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [brandSortOption, setBrandSortOption] = useState(DEFAULT_SORT_LABEL);
  const [campaignSortOption, setCampaignSortOption] =
    useState(DEFAULT_SORT_LABEL);
  const [brandSortApplied, setBrandSortApplied] = useState(false);
  const [campaignSortApplied, setCampaignSortApplied] = useState(false);
  const [pendingSort, setPendingSort] = useState(DEFAULT_SORT_LABEL);
  const [loading, setLoading] = useState(false);
  const [brandLikesApi, setBrandLikesApi] = useState<BrandLike[]>([]);
  const [campaignLikesApi, setCampaignLikesApi] = useState<CampaignLike[]>([]);

  useHideBottomTab(isFilterOpen);

  const currentSortOption =
    activeTab === "brand" ? brandSortOption : campaignSortOption;
  const currentSortApplied =
    activeTab === "brand" ? brandSortApplied : campaignSortApplied;
  const getSortButtonLabel = () => currentSortOption;
  const isFiltered = currentSortApplied;

  const brandSortOptions = useMemo(
    () =>
      ["매칭률 순", "인기 순", "신규 순"].map((label) => ({
        label,
        value: label,
      })),
    [],
  );
  const campaignSortOptions = useMemo(
    () =>
      ["매칭률 순", "인기 순", "금액 순", "마감 순"].map((label) => ({
        label,
        value: label,
      })),
    [],
  );

  const openSortSheet = () => {
    setPendingSort(currentSortOption);
    setIsFilterOpen(true);
  };

  useEffect(() => {
    if (!isFilterOpen) {
      setPendingSort(currentSortOption);
    }
  }, [currentSortOption, isFilterOpen]);

  const applySort = () => {
    if (activeTab === "brand") {
      setBrandSortOption(pendingSort);
      setBrandSortApplied(true);
    } else {
      setCampaignSortOption(pendingSort);
      setCampaignSortApplied(true);
    }
    setIsFilterOpen(false);
  };

  const brandLikes = useMemo(() => {
    return [...brandLikesApi].sort((a, b) => {
      switch (brandSortOption) {
        case "매칭률 순":
          return b.matchRate - a.matchRate;
        case "인기 순":
          return b.likeCount - a.likeCount;
        case "신규 순":
          return b.id - a.id;
        default:
          return 0;
      }
    });
  }, [brandSortOption, brandLikesApi]);

  const campaignLikes = useMemo(() => {
    return [...campaignLikesApi].sort((a, b) => {
      switch (campaignSortOption) {
        case "매칭률 순":
          return b.matchRate - a.matchRate;
        case "인기 순":
          return b.likeCount - a.likeCount;
        case "금액 순":
          return b.reward - a.reward;
        case "마감 순":
          return a.ddayValue - b.ddayValue;
        default:
          return 0;
      }
    });
  }, [campaignSortOption, campaignLikesApi]);

  useEffect(() => {
    let isMounted = true;
    const fetchScrap = async () => {
      try {
        setLoading(true);
        if (activeTab === "brand") {
          const res =
            await axiosInstance.get<CustomResponseFavoriteBrandListResponseDto>(
              "/api/v1/users/me/favorites/brand",
              {
                params: {
                  sort: BRAND_SORT_PARAM_MAP[brandSortOption] ?? "MATCH_SCORE",
                },
              },
            );
          if (!isMounted) return;
          if (!res.data?.isSuccess) {
            throw new Error(res.data?.message || "찜 목록 조회 실패");
          }
          const result = res.data.result;
          const mapped =
            result.brands?.map((b) => ({
              id: b.brandId,
              name: b.brandName,
              tags: b.tags ?? [],
              matchRate: b.matchingRatio ?? 0,
              likeCount: b.likeCount ?? 0,
              isLiked: true,
              logoUrl: b.brandLogoUrl ?? null,
            })) ?? [];
          setBrandLikesApi(mapped);
        } else {
          const res =
            await axiosInstance.get<CustomResponseFavoriteCampaignListResponseDto>(
              "/api/v1/users/me/favorites/campaign",
              {
                params: {
                  sort:
                    CAMPAIGN_SORT_PARAM_MAP[campaignSortOption] ??
                    "MATCH_SCORE",
                },
              },
            );
          if (!isMounted) return;
          if (!res.data?.isSuccess) {
            throw new Error(res.data?.message || "찜 목록 조회 실패");
          }
          const result = res.data.result;
          const mapped =
            result.campaigns?.map((c) => {
              const dday =
                c.dday === 0
                  ? "D-Day"
                  : c.dday > 0
                    ? `D-${c.dday}`
                    : `D+${Math.abs(c.dday)}`;
              return {
                id: c.campaignId,
                brand: c.brandName,
                title: c.campaignTitle,
                matchRate: c.matchingRatio ?? 0,
                likeCount: c.likeCount ?? 0,
                reward: c.rewardAmount ?? 0,
                dday,
                ddayValue: c.dday ?? 0,
                applicants: c.quota ? `${c.quota}명` : "-",
                isLiked: true,
                logoUrl: c.brandLogoUrl ?? null,
              };
            }) ?? [];
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
  }, [activeTab, brandSortOption, campaignSortOption]);

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
      prev.map((c) =>
        c.id === campaignId ? { ...c, isLiked: !c.isLiked } : c,
      ),
    );
    try {
      await axiosInstance.post(`/api/v1/campaigns/${campaignId}/like`);
    } catch (error) {
      console.error("캠페인 좋아요 토글 실패:", error);
      setCampaignLikesApi((prev) =>
        prev.map((c) =>
          c.id === campaignId ? { ...c, isLiked: !c.isLiked } : c,
        ),
      );
    }
  };

  return (
    <div className="h-screen-full bg-gradient-to-b from-[#F6F6FF] via-[#F3F3FA] to-[#E8E8FB]">
      <div className="w-full shadow-2xl flex flex-col">
        <div className="min-h-[60px]">
          <NavigationHeader
            title="내 찜"
            titleClassName="font-semibold"
            onBack={() => navigate(-1)}
          />
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
              <button
                type="button"
                onClick={openSortSheet}
                className={`flex items-center w-fit h-7 pl-3 pr-1.5 rounded-full border text-[14px] font-Pretendard ${
                  isFiltered
                    ? "border-core-3 text-core-1 bg-core-2"
                    : "border-core-2 text-text-gray2 bg-white text-title3"
                }`}
              >
                {getSortButtonLabel()}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="none"
                  className={`w-6 h-6 ${isFiltered ? "text-core-1" : "text-text-gray2"}`}
                >
                  <path
                    d="M6 8L10 12L14 8"
                    stroke="currentColor"
                    strokeWidth="1.0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {loading ? (
              <LoadingSpinner className="py-10" />
            ) : (
              <div className="mt-4 space-y-4">
                {activeTab === "brand" ? (
                  brandLikes.length > 0 ? (
                    brandLikes.map((brand) => (
                      <div
                        key={brand.id}
                        className="bg-white rounded-[14px] px-[10px] py-[10px] flex gap-4 items-center h-[100px]"
                      >
                        <div className="w-[80px] h-[80px] rounded-[5px] border border-[#E6E6F3] grid place-items-center text-[#1D1D1F] text-[16px] font-semibold whitespace-pre text-center">
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
                              <div className="text-[#6D6AFE]">
                                <span className="text-[12px] leading-[16px] font-medium">
                                  매칭률 
                                </span>{" "}
                                <span className="text-[16px] leading-[20px] font-semibold">
                                  {brand.matchRate}%
                                </span>
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
                          {brand.tags.length > 0
                            ? brand.tags.map((tag) => `#${tag}`).join(" ")
                            : ""}
                        </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-[#9B9BA1] text-[14px]">
                      찜한 브랜드가 없습니다.
                    </div>
                  )
                ) : campaignLikes.length > 0 ? (
                  campaignLikes.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="bg-white rounded-[10px] border border-[#E8E8FB] px-[10px] pt-[10px] pb-[6px] flex gap-4 items-start h-[120px]"
                    >
                      <div className="flex flex-col items-start gap-1">
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
                        <div className="flex items- gap-1">
                          {" "}
                          <span className="px-[3px] py-[1px] rounded-[5px] border border-[#6666E5] text-[#6666E5] text-[10px] leading-[14px]">
                            {campaign.dday}
                          </span>
                          <span className="px-[3px] py-[2px] rounded-[5px] bg-[#E6E6F3] text-[#6666E5] text-[10px] leading-[14px]">
                            {campaign.applicants}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 pt-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-[16px] leading-[20px] font-semibold text-[#171718] truncate">
                            {campaign.brand}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="mb-1 text-[#6D6AFE]">
                              <span className="text-[12px] leading-[16px] font-medium">
                                매칭률
                              </span>{" "}
                              <span className="text-[16px] leading-[20px] font-semibold">
                                {campaign.matchRate}%
                              </span>
                            </div>
                            <button
                              type="button"
                              className="mb-1 text-[#B7B7F3] text-[24px] leading-none"
                              aria-label="찜 해제"
                              onClick={() => toggleCampaignLike(campaign.id)}
                            >
                              {campaign.isLiked ? "♥" : "♡"}
                            </button>
                          </div>
                        </div>
                        <div className="mt-[3px] text-[14px] leading-[20px] font-medium text-[#171718] truncate">
                          {" "}
                          {campaign.title}
                        </div>
                        <div className="mt-[1px] text-[11px] leading-[16px] text-[#6666E5] font-medium">
                          {" "}
                          원고료: {campaign.reward.toLocaleString()}원
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-[#9B9BA1] text-[14px]">
                    찜한 캠페인이 없습니다.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <SortFilterSheet
          open={isFilterOpen}
          value={pendingSort}
          onChange={setPendingSort}
          onClose={() => setIsFilterOpen(false)}
          onApply={applySort}
          options={
            activeTab === "brand" ? brandSortOptions : campaignSortOptions
          }
          title="정렬 필터"
          applyLabel="적용하기"
          titleClassName="text-[14px] font-semibold"
          optionClassName="text-[12px]"
          applyButtonClassName="text-[13px] font-semibold"
        />
      </div>
    </div>
  );
}
