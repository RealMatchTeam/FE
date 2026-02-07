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

export type Gender = "MALE" | "FEMALE" | string;

export interface MeFeatureBeautyType {
  skinType: string[];
  skinBrightness: string;
  makeupStyle: string[];
  interestCategories: string[];
  interestFunctions: string[];
}

export interface MeFeatureFashionType {
  height: string;
  bodyShape: string;
  topSize: string;
  bottomSize: string;
  interestFields: string[];
  interestStyles: string[];
  interestBrands: string[];
}

export interface MeFeatureContentsType {
  viewerGender: string[];
  viewerAge: string[];
  avgVideoLength: string;
  avgViews: string;
  contentFormats: string[];
  contentTones: string[];
  desiredInvolvement: string[];
  desiredUsageScope: string[];
}

export interface MeFeatureResult {
  beautyType: MeFeatureBeautyType;
  fashionType: MeFeatureFashionType;
  contentsType: MeFeatureContentsType;
}

export interface MeFeatureResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MeFeatureResult;
}

export interface ProfileCardMatchingResult {
  creatorType: string;
}

export interface ProfileCardResult {
  nickname: string;
  profileImageUrl?: string;
  gender: Gender;
  age: number;
  snsAccount: string;
  interestFields: string[];
  matchingResult: ProfileCardMatchingResult;
}

export interface ProfileCardResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ProfileCardResult;
}
