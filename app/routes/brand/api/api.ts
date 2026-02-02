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
  campaignId: number;
  campaignTitle: string;
  campaignStartDate?: string;
  campaignDDay?: number;
  campaignMatchingRatio?: number;
  campaignDescription?: string;
  campaginManuscriptFee?: string;
  campaignIsLiked?: boolean;
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

export async function fetchBrandDetail(params: {
  brandId: string;
  domain?: BrandDomain;
}): Promise<BrandDetailData> {
  const { brandId, domain } = params;

  const response = await apiClient.get<BrandDetailApiResponse>(
    `/api/v1/brands/${brandId}`
  );

  if (!response.data.isSuccess || !response.data.result?.length) {
    throw new Error("브랜드 상세 조회 실패");
  }

  const data = response.data.result[0];

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

  // API 응답을 프론트 타입으로 변환
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
    ongoingCampaigns: (data.brandOnGoingCampaign || []).map((campaign) => ({
      id: String(campaign.campaignId),
      brandName: data.brandName,
      startAt: campaign.campaignStartDate || "",
      ddayLabel: campaign.campaignDDay ? `D-${campaign.campaignDDay}` : "",
      matchRate: campaign.campaignMatchingRatio || 0,
      descText: campaign.campaignDescription || campaign.campaignTitle,
      rewardText: campaign.campaginManuscriptFee || "",
      isLiked: campaign.campaignIsLiked || false,
    })),
    products: (data.availableSponsorProd || []).map((product) => ({
      id: String(product.productId),
      title: product.productName,
      imageUrl: product.productImageUrl || "",
    })),
    histories: [], // API에서 제공하지 않음
  };
}
