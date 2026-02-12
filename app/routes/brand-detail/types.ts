export type BrandDomain = "beauty" | "fashion";

export type TagGroup = {
  label: string;
  chips: string[];
};

export type BrandOngoingCampaign = {
  campaignId: number;
  brandName: string;
  title: string;
  recruitQuota: number;
  rewardAmount: number;
  imageUrl?: string;
  dday: number;
  isLiked?: boolean;
};

export type ProductMiniCardItem = {
  productId: number;
  productName: string;
  thumbnailImageUrl: string;
};

export type HistoryRowItem = {
  id: string;
  title: string;
  rightText: string;
  highlight?: boolean;
};

export type BrandDetailApiBeautyResponse = {
  categories: string[];
  skinType: string[];
  mainFunction: string[];
  makeUpStyle: string[];
};

export type BrandDetailApiFashionResponse = {
  categories: string[];
  brandType: string[];
  brandStyle: string[];
};

export type BrandDetailApiResult = {
  userId: number;
  brandName: string;
  brandImages: string[];
  logoUrl: string;
  simpleIntro: string;
  detailIntro: string;
  homepageUrl: string;
  brandTag: string[] | null;
  brandMatchingRatio: number;
  brandIsLiked: boolean;
  brandDescriptionTags: string[];
  beautyResponse?: BrandDetailApiBeautyResponse | null;
  fashionResponse?: BrandDetailApiFashionResponse | null;
};

export type BrandDetailResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: BrandDetailApiResult[];
};

export type BrandDetailData = {
  id: string;
  userId: number;
  brandUserId?: string;
  domain: BrandDomain;

  name: string;
  matchRate: number;

  heroImageUrl?: string;
  brandImages?: string[];

  logoText?: string;
  logoImageUrl?: string;

  homepageUrl?: string;
  simpleIntro?: string;

  hashtags: string[];
  description: string;

  categories: string[];

  tagSections: Array<{
    title: string;
    groups: TagGroup[];
  }>;

  isLiked?: boolean;

  ongoingCampaigns: BrandOngoingCampaign[];
  products: ProductMiniCardItem[];
  histories: HistoryRowItem[];
  historiesHasNext?: boolean;
};

export type BrandCampaignStatus = "UPCOMING" | "RECRUITING" | "CLOSED";

export type BrandCampaignDto = {
  campaignId: number;
  title: string;
  recruitStartDate: string;
  recruitEndDate: string;
  status: BrandCampaignStatus;
};

export type BrandCampaignsApiResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    campaigns: BrandCampaignDto[];
    hasNext: boolean;
  };
};

export type SponsorShippingType = "CREATOR_PAY" | "BRAND_PAY" | string;

export type SponsorAvailableItem = {
  itemId: number;
  availableType: string;
  availableQuantity: number;
  availableSize: number;
  sizeUnit?: string;
  shippingType: SponsorShippingType;
};

export type SponsorInfo = {
  items: SponsorAvailableItem[];
  shippingType?: string;
};

export type SponsorProductsListDto = {
  thumbnailImageUrl: string;
  brandId: number;
  brandName: string;
  productId: number;
  productName: string;
  productImageUrls: string[];
  categories: string[];
  sponsorInfo: SponsorInfo;
};

export type SponsorProductsApiResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: SponsorProductsListDto[];
};

export type SponsorProductAction = {
  canProposeCampaign: boolean;
  proposeCampaignCtaText: string;
};

export type SponsorProductDetailResult = {
  brandId: number;
  brandName: string;

  productId: number;
  productName: string;

  productImageUrls: string[];
  categories: string[];

  sponsorInfo: SponsorInfo;
};

export type SponsorProductDetailApiResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: SponsorProductDetailResult;
};
