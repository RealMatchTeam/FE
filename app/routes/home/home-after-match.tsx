import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { CategoryKey } from "./types";
import CategoryTabs from "./components/CategoryTabs";
import SectionHeader from "./components/SectionHeader";
import BrandCard from "./components/BrandCard";
import CampaignCard from "./components/CampaignCard";
import MatchAnalysisSection from "./components/MatchAnalysisSection";
import { getMatchingBrands, getMatchingCampaigns, toggleBrandLike, type MatchingBrand, type MatchingCampaign } from "../matching/api/matching";

export default function HomeAfterMatchPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryKey>("beauty");
  const [brands, setBrands] = useState<MatchingBrand[]>([]);
  const [campaigns, setCampaigns] = useState<MatchingCampaign[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsData, campaignsData] = await Promise.all([
          getMatchingBrands("MATCH_SCORE", "ALL"),
          getMatchingCampaigns("MATCH_SCORE", "ALL")
        ]);
        setBrands(brandsData.brands);
        setCampaigns(campaignsData);
      } catch (error) {
        console.error("Failed to fetch matching data:", error);
      }
    };

    fetchData();
  }, []);

  // 브랜드 좋아요 토글
  const handleBrandLikeToggle = async (id: string) => {
    try {
      const brandId = Number(id);
      console.log("🔍 Brand like toggle - ID:", brandId, "Type:", typeof brandId);
      const newLikeStatus = await toggleBrandLike(brandId);

      setBrands(prev => prev.map(brand =>
        brand.id === brandId ? { ...brand, isLiked: newLikeStatus } : brand
      ));
    } catch (error) {
      console.error("Failed to toggle brand like:", error);
    }
  };

  // 캠페인 좋아요 토글
  const handleCampaignLikeToggle = async (id: string) => {
    try {
      const campaignId = Number(id);
      const newLikeStatus = await toggleBrandLike(campaignId);

      setCampaigns(prev => prev.map(campaign =>
        campaign.id === campaignId ? { ...campaign, isLiked: newLikeStatus } : campaign
      ));
    } catch (error) {
      console.error("Failed to toggle campaign like:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white px-5 pt-6">
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
                  subText: brand.tags?.join(", ") || "",
                  badgeText: "모집중",
                  domain: brand.name?.toLowerCase() || "",
                  isLiked: brand.isLiked,
                }}
                onClick={() => {
                  navigate(`/brand?brandId=${brand.id}&domain=${brand.name?.toLowerCase() || ""}`);
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
                  ddayLabel: "",
                  progressText: String(campaign.applicants),
                  isLiked: campaign.isLiked,
                  logoUrl: campaign.logoUrl,
                }}
                variant="top"
                onClick={() => {
                  navigate(`/campaign?campaignId=${campaign.id}`);
                }}
                onLikeToggle={handleCampaignLikeToggle}
              />
            ))}
          </div>
        </section>

        {/* 인기 캠페인 */}
        <section className="mt-8 pb-24">
          <SectionHeader
            title="인기 캠페인"
            subtitle="이런 캠페인이 인기가 많아요!"
            onMore={() => navigate("/matching/campaign?sortBy=POPULARITY")}
          />

          <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {campaigns.slice(10, 20).map((campaign) => (
              <CampaignCard
                key={campaign.id}
                item={{
                  id: String(campaign.id),
                  brandName: campaign.brandName,
                  matchRate: campaign.matchRate || 0,
                  descText: campaign.name || campaign.title || "",
                  rewardText: `원고료 ${campaign.reward?.toLocaleString()}원`,
                  startAt: "",
                  ddayLabel: "",
                  progressText: String(campaign.applicants),
                  isLiked: campaign.isLiked,
                  logoUrl: campaign.logoUrl,
                }}
                variant="popular"
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
