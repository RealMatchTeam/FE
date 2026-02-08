import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import type {
  CategoryKey,
  CreatorProfileModel,
  MeFeatureResponse,
  MeFeatureResult,
  ProfileCardResponse,
  ProfileCardResult,
} from "./types";
import CategoryTabs from "./components/CategoryTabs";
import SectionHeader from "./components/SectionHeader";
import BrandCard from "./components/BrandCard";
import CampaignCard from "./components/CampaignCard";
import MatchAnalysisSection from "./components/MatchAnalysisSection";
import CreatorProfileCard from "./components/CreatorProfileCard";

import { useMatchResultStore } from "../../stores/matching-result";
import { useCampaignProposalStore } from "../../stores/campaign-proposal";

import {
  getMatchingBrands,
  getMatchingCampaigns,
  toggleBrandLike,
  toggleCampaignLike,
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

const toTypeParam = (ui: CategoryKey) =>
  ui === "beauty" ? "BEAUTY" : "FASHION";

const pickFirst = (arr?: string[]) => (Array.isArray(arr) ? arr[0] : undefined);

const getCampaignIdForLike = (c: MatchingCampaign): number | null => {
  const id = c.campaignId ?? c.id;
  if (typeof id !== "number") return null;
  return Number.isFinite(id) && id > 0 ? id : null;
};

const getCampaignId = (c: MatchingCampaign): number | null => {
  const anyC = c as unknown as {
    campaignId?: number;
    id?: number;
    campaign_id?: number;
  };
  const id = anyC.campaignId ?? anyC.campaign_id ?? anyC.id;
  if (typeof id !== "number") return null;
  return Number.isFinite(id) && id > 0 ? id : null;
};

const getBrandIdFromCampaign = (c: MatchingCampaign): number | null => {
  const anyC = c as unknown as {
    brandId?: number;
    brand_id?: number;
    brand?: { id?: number; brandId?: number };
  };
  const id =
    anyC.brandId ?? anyC.brand_id ?? anyC.brand?.brandId ?? anyC.brand?.id;

  if (typeof id !== "number") return null;
  return Number.isFinite(id) && id > 0 ? id : null;
};

export default function HomeAfterMatchPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryKey>("beauty");

  const [brands, setBrands] = useState<MatchingBrand[]>([]);
  const [campaigns, setCampaigns] = useState<MatchingCampaign[]>([]);
  const [popularCampaigns, setPopularCampaigns] = useState<MatchingCampaign[]>(
    [],
  );

  const [profileCard, setProfileCard] = useState<ProfileCardResult | null>(
    null,
  );
  const [feature, setFeature] = useState<MeFeatureResult | null>(null);

  const brandLikeInFlight = useRef<Set<number>>(new Set());
  const campaignLikeInFlight = useRef<Set<number>>(new Set());

  const matchResult = useMatchResultStore((s) => s.result);
  const setSnsAccount = useCampaignProposalStore((s) => s.setSnsAccount);

  useEffect(() => {
    let alive = true;

    const fetchHomeCore = async () => {
      const categoryFilter = toApiCategory(category);

      const [brandsData, campaignsData, popularData] = await Promise.all([
        getMatchingBrands("MATCH_SCORE", categoryFilter),
        getMatchingCampaigns("MATCH_SCORE" as CampaignSort, categoryFilter),
        getMatchingCampaigns("POPULARITY" as CampaignSort, categoryFilter),
      ]);

      if (!alive) return;

      setBrands(brandsData.brands);
      setCampaigns(campaignsData.campaigns);
      setPopularCampaigns(popularData.campaigns);
    };

    const fetchCreatorExtra = async () => {
      const [profileRes, featureRes] = await Promise.allSettled([
        apiClient.get<ProfileCardResponse>("/v1/users/me/profile-card"),
        apiClient.get<MeFeatureResponse>("/v1/users/me/feature"),
      ]);

      if (!alive) return;

      if (
        profileRes.status === "fulfilled" &&
        profileRes.value.data?.isSuccess
      ) {
        const profileData = profileRes.value.data.result;
        setProfileCard(profileData);

        // snsAccount를 zustand에 저장
        if (profileData.snsAccount) {
          setSnsAccount(profileData.snsAccount);
        }
      } else {
        setProfileCard(null);
      }

      if (
        featureRes.status === "fulfilled" &&
        featureRes.value.data?.isSuccess
      ) {
        setFeature(featureRes.value.data.result);
      } else {
        setFeature(null);
      }
    };

    fetchHomeCore().catch((e) => {
      console.error("home core fetch failed:", e);
      if (!alive) return;
      setBrands([]);
      setCampaigns([]);
      setPopularCampaigns([]);
    });

    fetchCreatorExtra().catch((e) => {
      console.error("creator extra fetch failed:", e);
      if (!alive) return;
      setProfileCard(null);
      setFeature(null);
    });

    return () => {
      alive = false;
    };
  }, [category]);

  const profile = useMemo<CreatorProfileModel | null>(() => {
    if (!profileCard || !feature) return null;

    const beautyType = feature.beautyType;
    const fashionType = feature.fashionType;
    const contentsType = feature.contentsType;

    if (!beautyType || !fashionType || !contentsType) return null;

    const beautyTrait =
      pickFirst(beautyType.makeupStyle) ??
      pickFirst(beautyType.skinType) ??
      pickFirst(beautyType.interestCategories) ??
      pickFirst(beautyType.interestFunctions);

    const fashionTrait =
      fashionType.bodyShape ??
      pickFirst(fashionType.interestStyles) ??
      pickFirst(fashionType.interestBrands) ??
      pickFirst(fashionType.interestFields);

    const contentTrait =
      contentsType.avgViews ??
      contentsType.avgVideoLength ??
      pickFirst(contentsType.contentFormats) ??
      pickFirst(contentsType.contentTones);

    return {
      creatorName: profileCard.nickname ?? "크리에이터 님",
      creatorType: "creator",
      summary: profileCard.matchingResult?.creatorType ?? "크리에이터",
      highlightBrandText:
        pickFirst(profileCard.interestFields) ?? "추천 브랜드를 확인해보세요",
      traits: {
        beauty: beautyTrait,
        fashion: fashionTrait,
        content: contentTrait,
      },
    };
  }, [profileCard, feature]);

  const profileModel = useMemo<CreatorProfileModel | null>(() => {
    if (profile) return profile;

    if (!matchResult) return null;

    return {
      creatorName: matchResult.summary.userName,
      creatorType: "creator",
      summary: matchResult.summary.userType,
      highlightBrandText: matchResult.summary.recommendedBrand,
      traits: {
        beauty: matchResult.summary.traits.beauty,
        fashion: matchResult.summary.traits.style,
        content: matchResult.summary.traits.content,
      },
    };
  }, [profile, matchResult]);

  const goCampaignDetail = (c: MatchingCampaign) => {
    const campaignId = getCampaignId(c);
    const brandId = getBrandIdFromCampaign(c);
    if (!campaignId || !brandId) return;

    navigate(
      `/campaign?brandId=${brandId}&campaignId=${campaignId}&domain=${category}`,
    );
  };

  const handleBrandLikeToggle = async (id: string) => {
    const brandId = Number(id);
    if (!Number.isFinite(brandId) || brandId <= 0) return;

    if (brandLikeInFlight.current.has(brandId)) return;
    brandLikeInFlight.current.add(brandId);

    const current = brands.find((b) => b.id === brandId)?.isLiked ?? false;
    const next = !current;

    setBrands((prev) =>
      prev.map((b) => (b.id === brandId ? { ...b, isLiked: next } : b)),
    );

    try {
      const serverStatus = await toggleBrandLike(brandId);
      setBrands((prev) =>
        prev.map((b) =>
          b.id === brandId ? { ...b, isLiked: serverStatus } : b,
        ),
      );
    } catch (e: unknown) {
      setBrands((prev) =>
        prev.map((b) => (b.id === brandId ? { ...b, isLiked: current } : b)),
      );
      console.error("brand like toggle failed:", e);
    } finally {
      brandLikeInFlight.current.delete(brandId);
    }
  };

  const handleCampaignLikeToggle = async (id: string) => {
    const clickedId = Number(id);
    if (!Number.isFinite(clickedId) || clickedId <= 0) return;

    const findCurrent = (list: MatchingCampaign[]) =>
      list.find((c) => (c.campaignId ?? c.id) === clickedId);

    const currentCampaign =
      findCurrent(campaigns) ?? findCurrent(popularCampaigns);
    if (!currentCampaign) return;

    const campaignId = getCampaignIdForLike(currentCampaign);
    if (!campaignId) return;

    if (campaignLikeInFlight.current.has(campaignId)) return;
    campaignLikeInFlight.current.add(campaignId);

    const current = currentCampaign.isLiked ?? false;
    const next = !current;

    const apply = (value: boolean) => {
      setCampaigns((prev) =>
        prev.map((c) =>
          (c.campaignId ?? c.id) === clickedId ? { ...c, isLiked: value } : c,
        ),
      );
      setPopularCampaigns((prev) =>
        prev.map((c) =>
          (c.campaignId ?? c.id) === clickedId ? { ...c, isLiked: value } : c,
        ),
      );
    };

    apply(next);

    try {
      await toggleCampaignLike(campaignId);
    } catch (e: unknown) {
      apply(current);
      console.error("campaign like toggle failed:", e);
    } finally {
      campaignLikeInFlight.current.delete(campaignId);
    }
  };

  const goBrandList = () => {
    navigate(`/matching/brand?type=${toTypeParam(category)}`);
  };

  const goCampaignList = () => {
    navigate(`/matching/campaign?type=${toTypeParam(category)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white px-5 pt-6">
        <div className="-mx-5 mb-4">
          <img
            src={category === "beauty" ? bannerBeauty : bannerFashion}
            alt="배너"
            className="h-[250px] w-full object-cover"
          />
        </div>

        <CategoryTabs value={category} onChange={setCategory} />

        <section className="mt-6">
          <SectionHeader
            title="매칭률 높은 브랜드"
            subtitle="이런 브랜드가 매칭률이 가장 높아요!"
            onMore={goBrandList}
          />

          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
            {brands.slice(0, 3).map((brand, i) => (
              <BrandCard
                key={`brand-${brand.id}-${i}`}
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
                  domain: category,
                  isLiked: brand.isLiked,
                }}
                onClick={() =>
                  navigate(`/brand?brandId=${brand.id}&domain=${category}`)
                }
                onLikeToggle={handleBrandLikeToggle}
              />
            ))}
          </div>
        </section>

        <MatchAnalysisSection />

        <section className="mt-7">
          <SectionHeader
            title="매칭률 높은 캠페인"
            subtitle="이런 캠페인이 매칭률이 가장 높아요!"
            onMore={goCampaignList}
          />

          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
            {campaigns.slice(0, 3).map((campaign, i) => {
              const safeCampaignId = getCampaignId(campaign);
              if (!safeCampaignId) return null;

              return (
                <CampaignCard
                  key={`match-${safeCampaignId}-${i}`}
                  item={{
                    id: String(safeCampaignId),
                    brandName: campaign.brandName,
                    matchRate: campaign.matchRate || 0,
                    descText: campaign.name || campaign.title || "",
                    rewardText: `원고료 ${campaign.reward?.toLocaleString()}원`,
                    ddayLabel:
                      campaign.dDay === 0
                        ? "D-DAY"
                        : campaign.dDay
                          ? `D-${campaign.dDay}`
                          : "",
                    progressText: String(campaign.applicants),
                    isLiked: campaign.isLiked,
                    logoUrl: campaign.logoUrl,
                  }}
                  onClick={() => goCampaignDetail(campaign)}
                  onLikeToggle={handleCampaignLikeToggle}
                />
              );
            })}
          </div>
        </section>

        {profileModel && (
          <div className="mt-8 px-1">
            <CreatorProfileCard
              model={profileModel}
              onMyProfileClick={() => navigate("/mypage")}
            />
          </div>
        )}

        <section className="mt-8 pb-24">
          <SectionHeader
            title="인기 캠페인"
            subtitle="이런 캠페인이 인기가 많아요!"
            onMore={goCampaignList}
          />

          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
            {popularCampaigns.slice(0, 3).map((campaign, i) => {
              const safeCampaignId = getCampaignId(campaign);
              if (!safeCampaignId) return null;

              return (
                <CampaignCard
                  key={`popular-${safeCampaignId}-${i}`}
                  item={{
                    id: String(safeCampaignId),
                    brandName: campaign.brandName,
                    matchRate: campaign.matchRate || 0,
                    descText: campaign.name || campaign.title || "",
                    rewardText: `원고료 ${campaign.reward?.toLocaleString()}원`,
                    ddayLabel:
                      campaign.dDay === 0
                        ? "D-DAY"
                        : campaign.dDay
                          ? `D-${campaign.dDay}`
                          : "",
                    progressText: String(campaign.applicants),
                    isLiked: campaign.isLiked,
                    logoUrl: campaign.logoUrl,
                  }}
                  onClick={() => goCampaignDetail(campaign)}
                  onLikeToggle={handleCampaignLikeToggle}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
