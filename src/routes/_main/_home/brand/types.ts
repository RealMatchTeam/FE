export type BrandDomain = "beauty" | "fashion";

export type TagGroup = {
  label: string; // TagGroup 컴포넌트 prop과 동일 (label/chips)
  chips: string[];
};

export type BrandOngoingCampaign = {
  id: string;
  brandName: string;
  startAt: string; // "7/10"
  ddayLabel: string; // "D-3"
  matchRate: number;
  descText: string;
  rewardText: string;
  isLiked: boolean;
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
  logoText?: string; // 텍스트 로고 (뷰티에서 사용)
  logoImageUrl?: string; // 이미지 로고 (패션에서 사용 가능)

  hashtags: string[];
  description: string;

  // 카테고리(뷰티: 스킨케어/메이크업, 패션: 의류 등)
  categories: string[];

  // 섹션 단위 태그 (뷰티: 2개 섹션, 패션: 1개 섹션)
  tagSections: Array<{
    title: string; // "스킨케어 태그" / "메이크업 태그" / "의류 태그"
    groups: TagGroup[];
  }>;

  ongoingCampaigns: BrandOngoingCampaign[];
  products: ProductMiniCardItem[];
  histories: HistoryRowItem[];
};
