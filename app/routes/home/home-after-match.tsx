import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CategoryKey } from "../../types/home";
import type { CreatorProfileModel } from "../../types/creator";

import CategoryTabs from "./components/CategoryTabs";
import SectionHeader from "./components/SectionHeader";
import BrandCard from "./components/BrandCard";
import CampaignCard from "./components/CampaignCard";
import MatchAnalysisSection from "./components/MatchAnalysisSection";
import CreatorProfileCard from "./components/CreatorProfileCard";
import { getMatchingBrands, getMatchingCampaigns, toggleBrandLike } from "../matching/api/matching";
import { useMatchResultStore } from "../../stores/matching-result";
import bannerBeauty from "../../assets/home-banner/banner-beauty.svg";
import bannerFashion from "../../assets/home-banner/banner-fashion.svg";
import { toast } from "sonner";

export default function HomeAfterMatchPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState<CategoryKey>("beauty");

  // 매칭 결과 스토어
  const matchResult = useMatchResultStore((s) => s.result);

  // 데이터 페칭 최적화 (react-query 사용)
  const { data: brandsData } = useQuery({
    queryKey: ["matchingBrands", "MATCH_SCORE", "ALL"],
    queryFn: () => getMatchingBrands("MATCH_SCORE", "ALL"),
  });

  const { data: campaignsData } = useQuery({
    queryKey: ["matchingCampaigns", "MATCH_SCORE", "ALL"],
    queryFn: () => getMatchingCampaigns("MATCH_SCORE", "ALL"),
  });

  const { data: popularCampaignsData } = useQuery({
    queryKey: ["matchingCampaigns", "POPULARITY", "ALL"],
    queryFn: () => getMatchingCampaigns("POPULARITY", "ALL"),
  });

  const brands = useMemo(() => brandsData?.brands || [], [brandsData]);
  const campaigns = useMemo(() => campaignsData?.campaigns || [], [campaignsData]);
  const popularCampaigns = useMemo(() => popularCampaignsData?.campaigns || [], [popularCampaignsData]);

  // 이미지 프리로딩 (성능 최적화)
  useEffect(() => {
    const images = [bannerBeauty, bannerFashion];
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // 좋아요 토글 Mutation
  const likeMutation = useMutation({
    mutationFn: async ({ id }: { id: number; type: "brand" | "campaign" }) => {
      // 기존 코드에서도 toggleBrandLike를 공용으로 사용함
      return toggleBrandLike(id);
    },
    onSuccess: (newLikeStatus) => {
      // 캐시 무효화하여 최신 상태 반영
      queryClient.invalidateQueries({ queryKey: ["matchingBrands"] });
      queryClient.invalidateQueries({ queryKey: ["matchingCampaigns"] });
      toast.success(newLikeStatus ? "좋아요 리스트에 추가되었습니다." : "좋아요가 취소되었습니다.");
    },
    onError: () => {
      toast.error("좋아요 처리에 실패했습니다.");
    }
  });

  // 브랜드 좋아요 토글 (useCallback)
  const handleBrandLikeToggle = useCallback((id: string) => {
    likeMutation.mutate({ id: Number(id), type: "brand" });
  }, [likeMutation]);

  // 캠페인 좋아요 토글 (useCallback)
  const handleCampaignLikeToggle = useCallback((id: string) => {
    likeMutation.mutate({ id: Number(id), type: "campaign" });
  }, [likeMutation]);

  // 프로필 데이터 가공 (useMemo)
  const profile = useMemo(() => {
    if (matchResult?.apiResult) {
      const apiResult = matchResult.apiResult;
      return {
        creatorName: "크리에이터 님",
        creatorType: "creator",
        summary: apiResult.userType || "크리에이터",
        highlightBrandText: apiResult.highMatchingBrandList?.brands?.[0]?.brandName || "매칭된 브랜드",
        traits: {
          beauty: apiResult.typeTag?.[0] || "특성 1",
          fashion: apiResult.typeTag?.[1] || "특성 2",
          content: apiResult.typeTag?.[2] || "특성 3",
        }
      } as CreatorProfileModel;
    } else if (matchResult?.summary) {
      return {
        creatorName: "크리에이터 님",
        creatorType: "creator",
        summary: matchResult.summary.userName || "크리에이터",
        highlightBrandText: matchResult.summary.recommendedBrand || "매칭된 브랜드",
        traits: {
          beauty: matchResult.summary.traits.beauty || "특성 1",
          fashion: matchResult.summary.traits.style || "특성 2",
          content: matchResult.summary.traits.content || "특성 3",
        }
      } as CreatorProfileModel;
    }
    return null;
  }, [matchResult]);

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
                  ddayLabel: campaign.dDay !== undefined ? (campaign.dDay === 0 ? "D-DAY" : `D-${campaign.dDay}`) : "",
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
                  ddayLabel: campaign.dDay !== undefined ? (campaign.dDay === 0 ? "D-DAY" : `D-${campaign.dDay}`) : "",
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
