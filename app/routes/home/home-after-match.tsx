import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import type { CategoryKey, CreatorProfileModel } from "./types";
import CategoryTabs from "./components/CategoryTabs";
import SectionHeader from "./components/SectionHeader";
import BrandCard from "./components/BrandCard";
import CampaignCard from "./components/CampaignCard";
import MatchAnalysisSection from "./components/MatchAnalysisSection";
import CreatorProfileCard from "./components/CreatorProfileCard";
import {
  getMatchingBrands,
  getMatchingCampaigns,
  toggleBrandLike,
  type MatchingBrand,
  type MatchingCampaign,
} from "../matching/api/matching";
import { useMatchResultStore } from "../../stores/matching-result";
import bannerBeauty from "../../assets/home-banner/banner-beauty.svg";
import bannerFashion from "../../assets/home-banner/banner-fashion.svg";

export default function HomeAfterMatchPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryKey>("beauty");
  const [brands, setBrands] = useState<MatchingBrand[]>([]);
  const [campaigns, setCampaigns] = useState<MatchingCampaign[]>([]);
  const [popularCampaigns, setPopularCampaigns] = useState<MatchingCampaign[]>(
    [],
  );

  // 스토어에서 매칭 결과 가져오지만 -> api/v1/me/feature로 변경
  const matchResult = useMatchResultStore((s) => s.result);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsData, campaignsData, popularData] = await Promise.all([
          getMatchingBrands("MATCH_SCORE", "ALL"),
          getMatchingCampaigns("MATCH_SCORE", "ALL"),
          getMatchingCampaigns("POPULARITY", "ALL"),
        ]);
        setBrands(brandsData.brands);
        setCampaigns(campaignsData.campaigns);
        setPopularCampaigns(popularData.campaigns);
      } catch (error) {
        console.error("Failed to fetch matching data:", error);
      }
    };

    fetchData();
  }, []);

  // 스토어에서 매칭 결과 가져오지만 -> api/v1/me/feature로 변경
  // 스토어에서 매칭 결과 가져오지만 -> api/v1/me/feature로 변경
  const profile = useMemo(() => {
    if (matchResult?.apiResult) {
      const apiResult = matchResult.apiResult;
      return {
        creatorName: "크리에이터 님",
        creatorType: "creator",
        summary: apiResult.userType || "크리에이터",
        highlightBrandText:
          apiResult.highMatchingBrandList?.brands[0]?.brandName ||
          "매칭된 브랜드",
        traits: {
          beauty: apiResult.typeTag?.[0] || "특성 1",
          fashion: apiResult.typeTag?.[1] || "특성 2",
          content: apiResult.typeTag?.[2] || "특성 3",
        },
      } as CreatorProfileModel;
    } else if (matchResult?.summary) {
      // apiResult가 없으면 summary 사용
      return {
        creatorName: "크리에이터 님",
        creatorType: "creator",
        summary: matchResult.summary.userName || "크리에이터",
        highlightBrandText:
          matchResult.summary.recommendedBrand || "매칭된 브랜드",
        traits: {
          beauty: matchResult.summary.traits.beauty || "특성 1",
          fashion: matchResult.summary.traits.style || "특성 2",
          content: matchResult.summary.traits.content || "특성 3",
        },
      } as CreatorProfileModel;
    }
    return null;
  }, [matchResult]);

  // 브랜드 좋아요 토글
  const handleBrandLikeToggle = async (id: string) => {
    try {
      const brandId = Number(id);
      const newLikeStatus = await toggleBrandLike(brandId);

      setBrands((prev) =>
        prev.map((brand) =>
          brand.id === brandId ? { ...brand, isLiked: newLikeStatus } : brand,
        ),
      );
    } catch (error) {
      console.error("Failed to toggle brand like:", error);
    }
  };

  // 캠페인 좋아요 토글
  const handleCampaignLikeToggle = async (id: string) => {
    try {
      const campaignId = Number(id);
      const newLikeStatus = await toggleBrandLike(campaignId);

      // 매칭률 높은 캠페인 업데이트
      setCampaigns((prev) =>
        prev.map((campaign) =>
          campaign.id === campaignId
            ? { ...campaign, isLiked: newLikeStatus }
            : campaign,
        ),
      );
      // 인기 캠페인도 업데이트
      setPopularCampaigns((prev) =>
        prev.map((campaign) =>
          campaign.id === campaignId
            ? { ...campaign, isLiked: newLikeStatus }
            : campaign,
        ),
      );
    } catch (error) {
      console.error("Failed to toggle campaign like:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white px-5 pt-6">
        {/* 배너 */}
        <div className="-mx-5 mb-4">
          <img
            src={category === "beauty" ? bannerBeauty : bannerFashion}
            alt={category === "beauty" ? "뷰티 배너" : "패션 배너"}
            className="h-[250px] w-full object-cover"
          />
        </div>

        {/* 카테고리 탭 */}
        <CategoryTabs value={category} onChange={setCategory} />

        {/* 매칭률 높은 브랜드 */}
        <section className="mt-6">
          <SectionHeader
            title="매칭률 높은 브랜드"
            subtitle="이런 브랜드가 매칭률이 가장 높아요!"
            onMore={() => navigate("/matching/brand")}
          />

          <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {brands.slice(0, 10).map((brand) => (
              <BrandCard
                key={brand.id}
                item={{
                  id: String(brand.id),
                  name: brand.name,
                  logoUrl: brand.logoUrl,
                  matchRate: brand.matchRate,
                  subText: (brand.tags ?? [])
                    .slice(0, 2)
                    .map((t) => `#${t}`)
                    .join(" "),
                  badgeText: "모집중",
                  domain: brand.name?.toLowerCase() || "",
                  isLiked: brand.isLiked,
                }}
                onClick={() => {
                  navigate(
                    `/brand?brandId=${brand.id}&domain=${brand.name?.toLowerCase() || ""}`,
                  );
                }}
                onLikeToggle={handleBrandLikeToggle}
              />
            ))}
          </div>
        </section>

        {/* Match Analysis */}
        <MatchAnalysisSection />

        {/* 매칭률 높은 캠페인 */}
        <section className="mt-7">
          <SectionHeader
            title="매칭률 높은 캠페인"
            subtitle="이런 캠페인이 매칭률이 가장 높아요!"
            onMore={() => navigate("/matching/campaign")}
          />

          <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {campaigns.slice(0, 10).map((campaign) => (
              <CampaignCard
                key={campaign.id}
                item={{
                  id: String(campaign.id),
                  brandName: campaign.brandName,
                  matchRate: campaign.matchRate || 0,
                  descText: campaign.name || campaign.title || "",
                  rewardText: `원고료 ${campaign.reward?.toLocaleString()}원`,
                  startAt: "",
                  ddayLabel:
                    campaign.dDay !== undefined
                      ? campaign.dDay === 0
                        ? "D-DAY"
                        : `D-${campaign.dDay}`
                      : "",
                  progressText: String(campaign.applicants),
                  isLiked: campaign.isLiked,
                  logoUrl: campaign.logoUrl,
                }}
                onClick={() => {
                  navigate(`/campaign?campaignId=${campaign.id}`);
                }}
                onLikeToggle={handleCampaignLikeToggle}
              />
            ))}
          </div>
        </section>

        {/* 크리에이터 프로필 카드 */}
        {profile && (
          <div className="mt-8 px-1">
            <CreatorProfileCard model={profile} />
          </div>
        )}

        {/* 인기 캠페인 */}
        <section className="mt-8 pb-24">
          <SectionHeader
            title="인기 캠페인"
            subtitle="이런 캠페인이 인기가 많아요!"
            onMore={() => navigate("/matching/campaign?sortBy=POPULARITY")}
          />

          <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {popularCampaigns.slice(0, 10).map((campaign) => (
              <CampaignCard
                key={campaign.id}
                item={{
                  id: String(campaign.id),
                  brandName: campaign.brandName,
                  matchRate: campaign.matchRate || 0,
                  descText: campaign.name || campaign.title || "",
                  rewardText: `원고료 ${campaign.reward?.toLocaleString()}원`,
                  startAt: "",
                  ddayLabel:
                    campaign.dDay !== undefined
                      ? campaign.dDay === 0
                        ? "D-DAY"
                        : `D-${campaign.dDay}`
                      : "",
                  progressText: String(campaign.applicants),
                  isLiked: campaign.isLiked,
                  logoUrl: campaign.logoUrl,
                }}
                onClick={() => {
                  navigate(`/campaign?campaignId=${campaign.id}`);
                }}
                onLikeToggle={handleCampaignLikeToggle}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
