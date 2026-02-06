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
  matchRate: number;
  isLiked?: boolean;
  subText?: string;
  badgeText?: string;
  domain: string;
}

export interface CampaignItem {
  id: string;
  brandName: string;
  logoUrl?: string;
  startAt?: string;
  ddayLabel?: string;
  matchRate?: number;
  progressText?: string;
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

/* ===== /api/v1/me/feature ===== */

export type Gender = "MALE" | "FEMALE" | string;

export interface MeMatchingResult {
  createrType: string;
  fitBrand: string;
}

export interface BeautyType {
  skinType: string[];
  skinBrightness: string;
  makeupStyle: string[];
}

export interface FashionType {
  height: number;
  bodyType: string;
  upperSize: string;
  bottomSize: number;
}

export interface ContentsType {
  gender: string;
  age: string;
  averageLength: string;
  averageView: string;
}

export interface MyType {
  beautyType: BeautyType;
  fashionType: FashionType;
  contentsType: ContentsType;
}

export interface MeFeatureResult {
  nickname: string;
  gender: Gender;
  age: number;
  interests: string[];
  snsAccount: string;
  matchingResult: MeMatchingResult;
  myType: MyType;
}

export interface MeFeatureResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MeFeatureResult;
}
