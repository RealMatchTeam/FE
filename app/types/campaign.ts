import type { ApiResponse } from "./common";

export type CampaignCategory = "BEAUTY" | "FASHION";

export interface Campaign {
    id: number;
    brandName: string;
    title: string;
    reward: number;
    matchRate: number;
    dDay: number;
    applicants: number;
    isLiked: boolean;
    logoUrl?: string;
    category: CampaignCategory;
}

export interface MatchingCampaign {
    id: number;
    brandName: string;
    name?: string;
    title?: string;
    campaignName?: string;
    category: string;
    manuscriptFee?: number;
    reward?: number;
    matchingRatio?: number;
    matchRate?: number;
    applicants: number;
    isLiked: boolean;
    logoUrl?: string;
    dDay?: number;
}

export interface TagItem {
    id: number;
    name: string;
}

export interface ProposalDetail {
    proposalId: string;
    brandId: number;
    creatorId: number;
    title: string;
    description: string;
    rewardAmount: number;
    productId: number;
    startDate: string;
    endDate: string;
    status: string;
    refusalReason?: string;
    createdAt: string;
    contentTags: {
        formats: TagItem[];
        categories: TagItem[];
        tones: TagItem[];
        involvements: TagItem[];
        usageRanges: TagItem[];
    };
}

export type ProposalResponse = ApiResponse<ProposalDetail>;
// 브랜드 상세에서 사용하는 캠페인 정보
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

export type MatchingCampaignListResponse = ApiResponse<{
    campaigns: MatchingCampaign[];
    count: number;
}>;


// 캠페인 제안 요청 타입
export interface CreateCampaignProposalRequest {
    brandId: number;
    creatorId: number;
    campaignId: number | null;
    campaignName: string;
    description: string;
    formats: { id: number }[];
    categories: { id: number }[];
    tones: { id: number }[];
    involvements: { id: number }[];
    usageRanges: { id: number }[];
    rewardAmount: number;
    productId: number;
    startDate: string;
    endDate: string;
}

