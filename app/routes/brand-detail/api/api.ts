import { apiClient } from "../../../api/axios";
import type {
  BrandDomain,
  BrandDetailData,
  TagGroup,
  BrandCampaignsApiResponse,
} from "../types";

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
  brandImages: string[];
  logoUrl?: string;
  simpleIntro?: string;
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

export type SponsorProductListResponseDto = {
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

type BrandCampaignDto =
  BrandCampaignsApiResponse["result"]["campaigns"][number];

function formatHistoryDate(c: BrandCampaignDto): {
  text: string;
  highlight: boolean;
} {
  if (c.status === "UPCOMING" || c.status === "RECRUITING") {
    const d = new Date(c.recruitStartDate);
    return {
      text: `${d.getMonth() + 1}월 ${d.getDate()}일 진행예정`,
      highlight: true,
    };
  }
  const d = new Date(c.recruitEndDate);
  const yy = d.getFullYear().toString().slice(2);
  return {
    text: `${d.getMonth() + 1}/${d.getDate()}/${yy} 완료`,
    highlight: false,
  };
}

function stripHash(values: string[] | undefined | null): string[] {
  if (!values?.length) return [];
  return values
    .map((v) => (v ?? "").toString().trim())
    .filter(Boolean)
    .map((v) => (v.startsWith("#") ? v.slice(1).trim() : v));
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

function inferDomain(item: BrandDetailItemDto): BrandDomain {
  return item.fashionResponse ? "fashion" : "beauty";
}

function buildCategories(domain: BrandDomain, item: BrandDetailItemDto): string[] {
  if (domain === "fashion") {
    const cats = unique(stripHash(item.fashionResponse?.categories));
    return cats.length ? cats : ["의류", "가방", "신발", "주얼리", "패션 소품"];
  }
  const cats = unique(stripHash(item.beautyResponse?.categories));
  return cats.length ? cats : ["스킨케어", "메이크업", "바디"];
}

function buildTagSections(
  domain: BrandDomain,
  item: BrandDetailItemDto,
): Array<{ title: string; groups: TagGroup[] }> {
  if (domain === "fashion") {
    const f = item.fashionResponse;
    if (!f) return [];

    const brandType = unique(stripHash(f.brandType));
    const brandStyle = unique(stripHash(f.brandStyle));

    const groups: TagGroup[] = [];
    if (brandType.length) groups.push({ label: "브랜드 종류", chips: brandType });
    if (brandStyle.length) groups.push({ label: "브랜드 스타일", chips: brandStyle });

    return groups.length ? [{ title: "의류 태그", groups }] : [];
  }

  const b = item.beautyResponse;
  if (!b) return [];

  const cats = unique(stripHash(b.categories));
  const skinType = unique(stripHash(b.skinType));
  const mainFunction = unique(stripHash(b.mainFunction));
  const makeUpStyle = unique(stripHash(b.makeUpStyle));

  const sections: Array<{ title: string; groups: TagGroup[] }> = [];

  if (cats.includes("스킨케어") || cats.includes("바디")) {
    const groups: TagGroup[] = [];
    if (skinType.length) groups.push({ label: "피부타입", chips: skinType });
    if (mainFunction.length) groups.push({ label: "주요기능", chips: mainFunction });
    if (groups.length) sections.push({ title: "스킨케어 태그", groups });
  }

  if (cats.includes("메이크업")) {
    const groups: TagGroup[] = [];
    if (makeUpStyle.length) groups.push({ label: "메이크업 스타일", chips: makeUpStyle });
    if (groups.length) sections.push({ title: "메이크업 태그", groups });
  }

  if (!sections.length) {
    const groups: TagGroup[] = [];
    if (skinType.length) groups.push({ label: "피부타입", chips: skinType });
    if (mainFunction.length) groups.push({ label: "주요기능", chips: mainFunction });
    if (makeUpStyle.length) groups.push({ label: "메이크업 스타일", chips: makeUpStyle });
    return groups.length ? [{ title: "태그", groups }] : [];
  }

  return sections;
}

async function safeGet<T>(p: Promise<T>): Promise<T | null> {
  try {
    return await p;
  } catch {
    return null;
  }
}

export async function fetchSponsorProductList(params: {
  brandId: string;
}): Promise<SponsorProductListResponseDto[]> {
  const { brandId } = params;

  const res = await apiClient.get<SponsorProductListApiResponse>(
    `/api/v1/brands/${brandId}/sponsor-products`,
  );

  const data = res.data;

  if (!data.isSuccess) {
    throw new Error(data.message || "협찬 가능 제품 조회 실패");
  }

  return data.result ?? [];
}

export async function fetchBrandDetail(params: {
  brandId: string;
  domain?: BrandDomain;
}): Promise<BrandDetailData> {
  const { brandId, domain } = params;

  const detailRes = await apiClient.get<BrandDetailApiResponse>(
    `/api/v1/brands/${brandId}`,
  );
  const detail = detailRes.data;

  if (!detail.isSuccess || !detail.result?.length) {
    throw new Error("브랜드 상세 조회 실패");
  }

  const item = detail.result[0];
  const resolvedDomain = domain ?? inferDomain(item);

  const safeDomain: BrandDomain =
    resolvedDomain === "fashion" && !item.fashionResponse
      ? "beauty"
      : resolvedDomain === "beauty" && !item.beautyResponse
        ? "fashion"
        : resolvedDomain;

  const productsRes = await safeGet(
    apiClient.get<SponsorProductListApiResponse>(
      `/api/v1/brands/${brandId}/sponsor-products`,
    ),
  );

  const campaignsRes = await safeGet(
    apiClient.get<BrandCampaignsApiResponse>(
      `/api/v1/brands/${brandId}/campaigns`,
    ),
  );

  const recruitingRes = await safeGet(
    apiClient.get<RecruitingCampaignsApiResponse>(
      `/api/v1/brands/${brandId}/campaigns/recruiting`,
    ),
  );

  const productList = productsRes?.data?.isSuccess ? productsRes.data.result : [];

  const historyList = campaignsRes?.data?.isSuccess
    ? campaignsRes.data.result.campaigns
    : [];

  const historiesHasNext =
    campaignsRes?.data?.isSuccess && campaignsRes.data.result.hasNext;

  const recruitingList = recruitingRes?.data?.isSuccess
    ? recruitingRes.data.result.campaigns
    : [];

  return {
    id: brandId,
    userId: item.userId,
    domain: safeDomain,

    name: item.brandName,
    matchRate: item.brandMatchingRatio ?? 0,

    heroImageUrl: item.brandImages?.[0] ?? "",
    brandImages: item.brandImages ?? [],

    logoText: item.brandName,
    logoImageUrl: item.logoUrl,

    hashtags: unique(stripHash(item.brandDescriptionTags)),
    description: item.simpleIntro ?? "",

    categories: buildCategories(safeDomain, item),
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
      return {
        id: String(c.campaignId),
        title: c.title,
        rightText: text,
        highlight,
      };
    }),

    historiesHasNext,
  };
}
