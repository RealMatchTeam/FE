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

// 홈 화면 카드 등에서 사용되는 컴팩트한 모델
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
