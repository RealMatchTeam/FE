// src/routes/_home/types.ts

export type CategoryKey = "beauty" | "fashion";

export interface HeroItem {
  id: string;
  imageUrl: string;
  alt: string;
}

export interface BrandItem {
  id: string;
  name: string;
  logoUrl?: string;
  matchRate: number; // 0~100
  isLiked?: boolean;
  subText?: string;
  badgeText?: string;

}

export interface CampaignItem {
  id: string;
  brandName: string;
  logoUrl?: string;

  // 카드 상단 배지용
  startAt?: string;   // top 캠페인에서는 날짜 배지로 쓸 수 있음(예: 7/10)
  ddayLabel?: string; // D-3, D-DAY 등

  // 카드 아래 오른쪽 텍스트
  matchRate?: number;     // top 캠페인: 98%
  progressText?: string;  // 인기 캠페인: 7/10, 1/5 등

  // 카드 아래 텍스트
  descText?: string;
  rewardText?: string;

  isLiked?: boolean;
}

export type CreatorType = "creator" | "seller" | "editor";

export interface CreatorTraits {
  beauty?: string;
  fashion?: string;
  content?: string;
}

export interface CreatorProfileModel {
  creatorName: string;
  creatorType: CreatorType;
  summary: string;
  highlightBrandText: string;
  traits: CreatorTraits;
}

export interface HomeAfterMatchCategoryData {
  category: CategoryKey;
  hero: HeroItem[];

  topBrands: BrandItem[];
  topCampaigns: CampaignItem[];

  creatorProfile: CreatorProfileModel;

  popularCampaigns: CampaignItem[];
}

export interface HomeAfterMatchResponse {
  beauty: HomeAfterMatchCategoryData;
  fashion: HomeAfterMatchCategoryData;
}
