import { apiClient } from "../../../api/axios";
import type { BrandDomain, BrandDetailData, TagGroup } from "../types";

type BeautyResponseDto = {
  categories: string[];
  skinType: string[];
  mainFunction: string[];
  makeUpStyle: string[];
};

type FashionResponseDto = {
  categories: string[];
  brandType: string[];
  brandStyle: string[];
};

type BrandDetailItemDto = {
  userId: number;
  brandName: string;
  logoUrl?: string;
  simpleIntro?: string;
  detailIntro?: string;
  homepageUrl?: string;

  brandTag: string | null;
  brandMatchingRatio: number;
  brandIsLiked: boolean;
  brandDescriptionTags: string[];

  beautyResponse: BeautyResponseDto | null;
  fashionResponse: FashionResponseDto | null;
};

type BrandDetailApiResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: BrandDetailItemDto[];
};

type RecruitingCampaignCardDto = {
  campaignId: number;
  brandName: string;
  title: string;
  recruitQuota: number;
  rewardAmount: number;
  imageUrl?: string;
  dday: number;
};

type RecruitingCampaignsApiResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: { campaigns: RecruitingCampaignCardDto[] };
};

type SponsorProductListResponseDto = {
  id: number;
  name: string;
  thumbnailImageUrl: string;
  totalCount: number;
  currentCount: number;
};

type SponsorProductListApiResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: SponsorProductListResponseDto[];
};

type BrandCampaignResponseDto = {
  campaignId: number;
  title: string;
  recruitStartDate: string;
  recruitEndDate: string;
  status: "UPCOMING" | "RECRUITING" | "CLOSED";
};

type BrandCampaignSliceResponse = {
  campaigns: BrandCampaignResponseDto[];
  nextCursor?: number;
};

type BrandCampaignApiResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: BrandCampaignSliceResponse;
};

function formatHistoryDate(
  campaign: BrandCampaignResponseDto
): { text: string; highlight: boolean } {
  if (campaign.status === "UPCOMING" || campaign.status === "RECRUITING") {
    const date = new Date(campaign.recruitStartDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return { text: `${month}월 ${day}일 진행예정`, highlight: true };
  }
  const date = new Date(campaign.recruitEndDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear().toString().slice(2);
  return { text: `${month}/${day}/${year} 완료`, highlight: false };
}

function inferDomain(item: BrandDetailItemDto): BrandDomain {
  return item.fashionResponse ? "fashion" : "beauty";
}

function buildCategories(domain: BrandDomain): string[] {
  if (domain === "fashion") return ["패션"];
  return ["스킨케어", "메이크업"];
}

function buildTagSections(domain: BrandDomain, item: BrandDetailItemDto): Array<{ title: string; groups: TagGroup[] }> {
  if (domain === "fashion") {
    const f = item.fashionResponse;
    if (!f) return [];

    const styleGroups: TagGroup[] = [];

    if (f.categories?.length) styleGroups.push({ label: "카테고리", chips: f.categories });
    if (f.brandType?.length) styleGroups.push({ label: "브랜드 타입", chips: f.brandType });
    if (f.brandStyle?.length) styleGroups.push({ label: "브랜드 스타일", chips: f.brandStyle });

    return styleGroups.length ? [{ title: "스타일", groups: styleGroups }] : [];
  }

  const b = item.beautyResponse;
  if (!b) return [];

  const styleGroups: TagGroup[] = [];

  if (b.categories?.length) styleGroups.push({ label: "카테고리", chips: b.categories });
  if (b.skinType?.length) styleGroups.push({ label: "피부타입", chips: b.skinType });
  if (b.mainFunction?.length) styleGroups.push({ label: "주요 기능", chips: b.mainFunction });
  if (b.makeUpStyle?.length) styleGroups.push({ label: "메이크업 스타일", chips: b.makeUpStyle });

  return styleGroups.length ? [{ title: "스타일", groups: styleGroups }] : [];
}

export async function fetchBrandDetail(params: { brandId: string; domain?: BrandDomain }): Promise<BrandDetailData> {
  const { brandId, domain } = params;

  const [detailRes, productsRes, campaignsRes, recruitingRes] = await Promise.all([
    apiClient.get<BrandDetailApiResponse>(`/api/v1/brands/${brandId}`),
    apiClient.get<SponsorProductListApiResponse>(`/api/v1/brands/${brandId}/sponsor-products`),
    apiClient.get<BrandCampaignApiResponse>(`/api/v1/brands/${brandId}/campaigns`),
    apiClient.get<RecruitingCampaignsApiResponse>(`/api/v1/brands/${brandId}/campaigns/recruiting`),
  ]);

  const detail = detailRes.data;
  if (!detail.isSuccess || !detail.result?.length) throw new Error("브랜드 상세 조회 실패");

  const item = detail.result[0];
  const resolvedDomain = domain ?? inferDomain(item);

  const safeDomain: BrandDomain =
    resolvedDomain === "fashion" && !item.fashionResponse
      ? "beauty"
      : resolvedDomain === "beauty" && !item.beautyResponse
      ? "fashion"
      : resolvedDomain;

  const productList = productsRes.data.isSuccess ? productsRes.data.result : [];
  const historyList = campaignsRes.data.isSuccess ? campaignsRes.data.result.campaigns : [];
  const recruitingList = recruitingRes.data.isSuccess ? recruitingRes.data.result.campaigns : [];

  return {
    id: brandId,
    userId: item.userId,
    domain: safeDomain,

    name: item.brandName,
    matchRate: item.brandMatchingRatio ?? 0,

    heroImageUrl: "",
    logoText: item.brandName,
    logoImageUrl: item.logoUrl,

    hashtags: item.brandDescriptionTags ?? [],
description: item.simpleIntro ?? "",

    categories: buildCategories(safeDomain),
    tagSections: buildTagSections(safeDomain, item),

    ongoingCampaigns: recruitingList.map((c) => ({
      campaignId: c.campaignId,
      brandName: c.brandName,
      title: c.title,
      recruitQuota: c.recruitQuota,
      rewardAmount: c.rewardAmount,
      imageUrl: c.imageUrl,
      dday: c.dday,
      isLiked: false,
    })),

    products: productList.map((p) => ({
      id: String(p.id),
      title: p.name,
      imageUrl: p.thumbnailImageUrl || "",
    })),

    histories: historyList.map((c) => {
      const { text, highlight } = formatHistoryDate(c);
      return { id: String(c.campaignId), title: c.title, rightText: text, highlight };
    }),
  };
}
