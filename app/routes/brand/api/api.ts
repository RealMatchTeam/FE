import { apiClient } from "../../../api/axios";
import type { BrandDomain, BrandDetailData, TagGroup } from "../types";

// API 응답 타입
interface BrandSkinCareTagDto {
  brandSkinType?: string[];
  brandMainFunction?: string[];
}

interface BrandMakeUpTagDto {
  brandMakeUpStyle?: string[];
  brandMakeUpColor?: string[];
}

interface BrandOnGoingCampaignDto {
  brandId: number;
  brandName: string;
  recruitingTotalNumber: number;
  recruitedNumber: number;
  campaginDescription: string;
  campaginManuscriptFee: string;
  campaignDDay?: number;
  logoUrl?: string;
  isLiked?: boolean;
}

// 진행 중인 캠페인 API 응답 (api.md 1839줄)
interface RecruitingCampaignCardDto {
  campaignId: number;
  brandName: string;
  title: string;
  recruitQuota: number;
  rewardAmount: number;
  imageUrl?: string;
  dday: number;
}

interface RecruitingCampaignsApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    campaigns: RecruitingCampaignCardDto[];
  };
}

interface AvailableSponsorProdDto {
  productId: number;
  productName: string;
  productImageUrl?: string;
  availableType?: string;
  availableQuantity?: number;
  availableSize?: number;
}

interface BrandDetailResponseDto {
  brandName: string;
  brandTag?: string[];
  brandDescription?: string;
  brandMatchingRatio?: number;
  brandIsLiked?: boolean;
  brandCategory?: string[];
  brandSkinCareTag?: BrandSkinCareTagDto;
  brandMakeUpTag?: BrandMakeUpTagDto;
  brandOnGoingCampaign?: BrandOnGoingCampaignDto[];
  availableSponsorProd?: AvailableSponsorProdDto[];
}

interface BrandDetailApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: BrandDetailResponseDto[];
}

interface SponsorProductListResponseDto {
  id: number;
  name: string;
  thumbnailImageUrl: string;
  totalCount: number;
  currentCount: number;
}

interface SponsorProductListApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: SponsorProductListResponseDto[];
}

interface BrandCampaignResponseDto {
  campaignId: number;
  title: string;
  recruitStartDate: string;
  recruitEndDate: string;
  status: "UPCOMING" | "RECRUITING" | "CLOSED";
}

interface BrandCampaignSliceResponse {
  campaigns: BrandCampaignResponseDto[];
  nextCursor?: number;
}

interface BrandCampaignApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: BrandCampaignSliceResponse;
}

// 날짜 포맷팅 헬퍼
function formatHistoryDate(campaign: BrandCampaignResponseDto): { text: string; highlight: boolean } {
  if (campaign.status === "UPCOMING" || campaign.status === "RECRUITING") {
    const date = new Date(campaign.recruitStartDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return {
      text: `${month}월 ${day}일 진행예정`,
      highlight: true
    };
  } else {
    const date = new Date(campaign.recruitEndDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().slice(2);
    return {
      text: `${month}/${day}/${year} 완료`,
      highlight: false
    };
  }
}


export async function fetchBrandDetail(params: {
  brandId: string;
  domain?: BrandDomain;
}): Promise<BrandDetailData> {
  const { brandId, domain } = params;

  // 네 API 병렬 호출 (상세, 협찬제품, 캠페인 내역, 진행중인 캠페인)
  const [detailResponse, productsResponse, campaignsResponse, recruitingResponse] = await Promise.all([
    apiClient.get<BrandDetailApiResponse>(`/api/v1/brands/${brandId}`),
    // 협찬 가능 제품 리스트 별도 호출 (api.md line 1652)
    apiClient.get<SponsorProductListApiResponse>(`/api/v1/brands/${brandId}/sponsor-products`),
    // 캠페인 내역 호출 (api.md line 1785)
    apiClient.get<BrandCampaignApiResponse>(`/api/v1/brands/${brandId}/campaigns`),
    // 진행 중인 캠페인 호출 (api.md line 1839)
    apiClient.get<RecruitingCampaignsApiResponse>(`/api/v1/brands/${brandId}/campaigns/recruiting`)
  ]);

  if (!detailResponse.data.isSuccess || !detailResponse.data.result?.length) {
    throw new Error("브랜드 상세 조회 실패");
  }

  const data = detailResponse.data.result[0];

  // 협찬 제품 리스트
  const productList = productsResponse.data.isSuccess ? productsResponse.data.result : [];

  // 캠페인 내역 리스트
  const historyList = campaignsResponse.data.isSuccess ? campaignsResponse.data.result.campaigns : [];

  // 진행 중인 캠페인 리스트
  const recruitingList = recruitingResponse.data.isSuccess ? recruitingResponse.data.result.campaigns : [];


  // 태그 섹션 구성
  const tagSections: Array<{ title: string; groups: TagGroup[] }> = [];

  if (data.brandSkinCareTag) {
    const groups: TagGroup[] = [];
    if (data.brandSkinCareTag.brandSkinType?.length) {
      groups.push({ label: "피부타입", chips: data.brandSkinCareTag.brandSkinType });
    }
    if (data.brandSkinCareTag.brandMainFunction?.length) {
      groups.push({ label: "주요기능", chips: data.brandSkinCareTag.brandMainFunction });
    }
    if (groups.length) {
      tagSections.push({ title: "스킨케어 태그", groups });
    }
  }

  if (data.brandMakeUpTag) {
    const groups: TagGroup[] = [];
    if (data.brandMakeUpTag.brandMakeUpStyle?.length) {
      groups.push({ label: "메이크업 스타일", chips: data.brandMakeUpTag.brandMakeUpStyle });
    }
    if (data.brandMakeUpTag.brandMakeUpColor?.length) {
      groups.push({ label: "컬러", chips: data.brandMakeUpTag.brandMakeUpColor });
    }
    if (groups.length) {
      tagSections.push({ title: "메이크업 태그", groups });
    }
  }

  return {
    id: brandId,
    domain: domain || "beauty",
    name: data.brandName,
    matchRate: data.brandMatchingRatio || 0,
    heroImageUrl: "", // API에 없으면 빈 값
    logoText: data.brandName,
    hashtags: data.brandTag || [],
    description: data.brandDescription || "",
    categories: data.brandCategory || [],
    tagSections,
    ongoingCampaigns: recruitingList.map((campaign) => ({
      campaignId: campaign.campaignId,
      brandName: campaign.brandName,
      title: campaign.title,
      recruitQuota: campaign.recruitQuota,
      rewardAmount: campaign.rewardAmount,
      imageUrl: campaign.imageUrl,
      dday: campaign.dday,
      isLiked: false,
    })),
    products: productList.map((product) => ({
      id: String(product.id),
      title: product.name,
      imageUrl: product.thumbnailImageUrl || "",
    })),
    // 캠페인 내역 매핑
    histories: historyList.map(campaign => {
      const { text, highlight } = formatHistoryDate(campaign);
      return {
        id: String(campaign.campaignId),
        title: campaign.title,
        rightText: text,
        highlight
      };
    }),
  };
}
