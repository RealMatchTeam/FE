// src/routes/_home/home-after-match.tsx

import { useEffect, useMemo, useState } from "react";
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
import { apiClient } from "../../api/axios";
import bannerBeauty from "../../assets/home-banner/banner-beauty.svg";
import bannerFashion from "../../assets/home-banner/banner-fashion.svg";

type ApiCategoryFilter = "ALL" | "FASHION" | "BEAUTY";
type CampaignSort = "MATCH_SCORE" | "POPULARITY" | "REWARD_AMOUNT" | "D_DAY";

const toApiCategory = (ui: CategoryKey): ApiCategoryFilter =>
  ui === "beauty" ? "BEAUTY" : "FASHION";

/** ✅ /api/v1/users/me/profile-card (예시 기반) */
type ProfileCardResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    nickname: string;
    gender: "MALE" | "FEMALE" | string;
    age: number;
    interests: string[];
    snsAccount: string;
    matchingResult: {
      createrType: string; // 백엔드 오타 그대로
      fitBrand: string;
    };
    myType: {
      beautyType: {
        skinType: string[];
        skinBrightness: string;
        makeupStyle: string[];
      };
      fashionType: {
        height: number;
        bodyType: string;
        upperSize: string;
        bottomSize: number;
      };
      contentsType: {
        gender: string;
        age: string;
        averageLength: string;
        averageView: string;
      };
    };
  };
};

export default function HomeAfterMatchPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryKey>("beauty");

  const [brands, setBrands] = useState<MatchingBrand[]>([]);
  const [campaigns, setCampaigns] = useState<MatchingCampaign[]>([]);
  const [popularCampaigns, setPopularCampaigns] = useState<MatchingCampaign[]>(
    [],
  );

  const [profileCard, setProfileCard] =
    useState<ProfileCardResponse["result"] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryFilter: ApiCategoryFilter = toApiCategory(category);

        // ✅ 홈 핵심 데이터는 먼저(프로필 API 실패해도 홈은 떠야 함)
        const [brandsData, campaignsData, popularData] = await Promise.all([
          getMatchingBrands("MATCH_SCORE", categoryFilter),
          getMatchingCampaigns("MATCH_SCORE" as CampaignSort, categoryFilter),
          getMatchingCampaigns("POPULARITY" as CampaignSort, categoryFilter),
        ]);

        setBrands(brandsData.brands);
        setCampaigns(campaignsData.campaigns);
        setPopularCampaigns(popularData.campaigns);

        // ✅ 프로필 카드 (경로 수정)
        try {
          const res = await apiClient.get<ProfileCardResponse>(
            "/api/v1/users/me/profile-card",
          );

          if (res.data?.isSuccess) {
            setProfileCard(res.data.result);
          } else {
            setProfileCard(null);
          }
        } catch {
          setProfileCard(null);
        }
      } catch (error) {
        console.error("Failed to fetch matching data:", error);
      }
    };

    fetchData();
  }, [category]);

  const profile = useMemo<CreatorProfileModel | null>(() => {
    if (!profileCard) return null;

    const nickname = profileCard.nickname || "크리에이터 님";
    const creatorType =
      profileCard.matchingResult?.createrType || "크리에이터";
    const fitBrand = profileCard.matchingResult?.fitBrand || "매칭된 브랜드";

    const beautyTrait =
      profileCard.myType?.beautyType?.makeupStyle?.[0] ||
      profileCard.myType?.beautyType?.skinType?.[0] ||
      "특성 1";
    const fashionTrait =
      profileCard.myType?.fashionType?.bodyType ||
      (profileCard.myType?.fashionType?.upperSize
        ? `상의 ${profileCard.myType.fashionType.upperSize}`
        : "특성 2");
    const contentTrait =
      profileCard.myType?.contentsType?.averageView ||
      profileCard.myType?.contentsType?.averageLength ||
      "특성 3";

    return {
      creatorName: nickname,
      creatorType: "creator",
      summary: creatorType,
      highlightBrandText: fitBrand,
      traits: {
        beauty: beautyTrait,
        fashion: fashionTrait,
        content: contentTrait,
      },
    };
  }, [profileCard]);

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

  const handleCampaignLikeToggle = async (id: string) => {
    try {
      const campaignId = Number(id);
      const newLikeStatus = await toggleBrandLike(campaignId);

      setCampaigns((prev) =>
        prev.map((campaign) =>
          campaign.id === campaignId
            ? { ...campaign, isLiked: newLikeStatus }
            : campaign,
        ),
      );

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
            onMore={() => navigate(`/matching/brand?category=${category}`)}
          />

          <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {brands.slice(0, 10).map((brand, i) => (
              <BrandCard
                key={`brand-${brand.id ?? "noid"}-${brand.name ?? ""}-${i}`}
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
                    `/brand?brandId=${brand.id}&domain=${
                      brand.name?.toLowerCase() || ""
                    }`,
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
            onMore={() => navigate(`/matching/campaign?category=${category}`)}
          />

          <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {campaigns.slice(0, 10).map((campaign, i) => (
              <CampaignCard
                key={`match-${campaign.id ?? "noid"}-${campaign.brandName ?? ""}-${
                  campaign.title ?? campaign.name ?? ""
                }-${i}`}
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

{profile && (
  <div className="mt-8 px-1">
    <CreatorProfileCard
      model={profile}
      onMyProfileClick={() => navigate("/mypage")}
    />
  </div>
)}

        {/* 인기 캠페인 */}
        <section className="mt-8 pb-24">
          <SectionHeader
            title="인기 캠페인"
            subtitle="이런 캠페인이 인기가 많아요!"
            onMore={() =>
              navigate(
                `/matching/campaign?sortBy=POPULARITY&category=${category}`,
              )
            }
          />

          <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {popularCampaigns.slice(0, 10).map((campaign, i) => (
              <CampaignCard
                key={`popular-${campaign.id ?? "noid"}-${
                  campaign.brandName ?? ""
                }-${campaign.title ?? campaign.name ?? ""}-${i}`}
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
