import type { ApiResponse } from "./common";
import type { BrandOngoingCampaign } from "./campaign";

export type BrandCategory = "BEAUTY" | "FASHION";
export type BrandDomain = "beauty" | "fashion";


export interface Brand {
    id: number;
    name: string;
    matchRate: number;
    tags: string[];
    isLiked: boolean;
    logoUrl?: string;
    category: BrandCategory;
}

// 매칭 API에서 사용하는 브랜드 정보
export interface MatchingBrand {
    id: number;
    name: string;
    logoUrl?: string;
    matchRate: number;
    matchingRatio?: number;
    isLiked: boolean;
    category: string;
    tags?: string[];
}

// 상세 정보 내 브랜드 타입
export interface BrandDetail {
    brandName: string;
    brandTag: string[];
    brandDescription: string;
    brandMatchingRatio: number;
    brandIsLiked: boolean;
    brandCategory: string[];
}

export interface BrandLikeResponseDto {
    brandIsLiked: boolean;
}

export type TagGroup = {
    label: string;
    chips: string[];
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



export type BrandResponse = ApiResponse<BrandDetail[]>;
export type MatchingBrandListResponse = ApiResponse<{
    brands: MatchingBrand[];
    count: number;
}>;
