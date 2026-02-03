export type BrandDomain = "beauty" | "fashion";

export type TagGroup = {
  label: string;
  chips: string[];
};

export type BrandOngoingCampaign = {
  campaignId: number;
  brandName: string;
  title: string;
  recruitQuota: number; // 총 모집 인원
  rewardAmount: number; // 원고료
  imageUrl?: string;
  dday: number;
  isLiked?: boolean;
};

export type ProductMiniCardItem = {
  id: string;
  title: string;
  imageUrl: string;
};

export type HistoryRowItem = {
  id: string;
  title: string;
  rightText: string;
  highlight?: boolean;
};

export type BrandDetailData = {
  id: string;
  domain: BrandDomain;

  name: string;
  matchRate: number;

  heroImageUrl: string;
  logoText?: string;
  logoImageUrl?: string;

  hashtags: string[];
  description: string;

  categories: string[];

  tagSections: Array<{
    title: string;
    groups: TagGroup[];
  }>;

  ongoingCampaigns: BrandOngoingCampaign[];
  products: ProductMiniCardItem[];
  histories: HistoryRowItem[];
};
