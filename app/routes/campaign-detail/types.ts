export type ApiTagItem = { id: number; name: string };

export type CampaignContentTags = {
  viewerGenders: ApiTagItem[];
  viewerAges: ApiTagItem[];
  avgVideoLengths: ApiTagItem[];
  avgVideoViews: ApiTagItem[];
  formats: ApiTagItem[];
  categories: ApiTagItem[];
  tones: ApiTagItem[];
  involvements: ApiTagItem[];
  usageRanges: ApiTagItem[];
};

export type CampaignCategory = "BEAUTY" | "FASHION";

export type CampaignDetail = {
  campaignId: number;
  title: string;
  description: string;

  imageUrl: string | null;
  category: CampaignCategory;

  preferredSkills: string;
  schedule: string;
  videoSpec: string;
  product: string;

  rewardAmount: number;

  startDate: string;
  endDate: string;

  recruitStartDate: string;
  recruitEndDate: string;

  dday: number;
  quota: number;

  contentTags: CampaignContentTags;

  like: boolean;
};

export type CampaignDetailApiResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: CampaignDetail;
};
