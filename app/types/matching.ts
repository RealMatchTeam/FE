import type { MatchingBrand } from "./brand";
import type { TagItem } from "./campaign";


export interface MatchResult {
    userType: string;
    typeTag: string[];
    highMatchingBrandList?: {
        count: number;
        brands: MatchingBrand[];
    };
    count: number;
    brands: MatchingBrand[];
}

export interface MatchResponseDto {
    userType: string;
    typeTag: string[];
    highMatchingBrandList: {
        count: number;
        brands: { brandId: number; logoUrl?: string; brandName: string }[];
    };
    count: number;
    brands: { brandId: number; logoUrl?: string; brandName: string }[];
}

export interface MatchCampaignRawItem {
    brandId: number;
    campaignId?: number;
    brandName: string;
    campaignName: string;
    category: string;
    campaignManuscriptFee: number;
    brandMatchingRatio: number;
    campaignTotalCurrentRecruit: number;
    campaignTotalRecruit: number;
    brandIsLiked: boolean;
    brandLogoUrl: string;
    campaignDDay: number;
    campaignDetail?: string;
}

export interface MatchBrandRawItem {
    brandId: number;
    brandName: string;
    logoUrl: string;
    matchingRatio: number;
    brandIsLiked?: boolean;
    category?: string;
    tags?: string[];
    brandLogoUrl?: string;
    brandMatchingRatio?: number;
    brandTags?: string[];
}


// 필터 관련
export interface CategoryDto {
    categoryId: number;
    categoryName: string;
}

export interface FunctionDto {
    functionId: number;
    functionName: string;
}

export interface SkinTypeDto {
    skinTypeId: number;
    skinTypeName: string;
}

export interface MakeUpStyleDto {
    makeUpId: number;
    makeUpName: string;
}

export interface BeautyFilterDto {
    category: CategoryDto[];
    function: FunctionDto[];
    skinType: SkinTypeDto[];
    makeUpStyle: MakeUpStyleDto[];
}

export interface BrandFilterResponseDto {
    beautyFilter: BeautyFilterDto;
}

// 매칭 테스트 요청 DTO
export interface MatchRequestDto {
    userId: string | number;
    sex: string;
    age: number;
    height: number;
    weight: number;
    size: {
        upper: number;
        bottom: number;
    };
    beauty: {
        interests: string[];
        functions: string[];
        skinType: string;
        skinTone: string;
        makeupStyle: string;
    };
    fashion: {
        styles: string[];
        items: string[];
        preferredBrands: string[];
    };
    sns: {
        url: string;
        mainAudience: {
            sex: string[];
            age: string[];
        };
        contentStyle: {
            avgVideoLength: string;
            avgViews: string;
            format: string;
            type: string;
            contributionLevel: string;
            usageCoverage: string;
        };
    };
}


export const SORT_OPTIONS = ["매칭률 순", "인기 순", "신규 순"] as const;
export type SortOption = typeof SORT_OPTIONS[number];

export const CAMPAIGN_SORT_OPTIONS = ["매칭률 순", "인기 순", "금액 순", "마감 순"] as const;
export type CampaignSortOption = typeof CAMPAIGN_SORT_OPTIONS[number];


export type BeautyTags = {
    tagType: string;
    categories: Record<string, TagItem[]>;
};

export type FashionTags = {
    tagType: string;
    categories: Record<string, TagItem[]>;
};

export type ContentTags = {
    viewerGenders: TagItem[];
    viewerAges: TagItem[];
    avgVideoLengths: TagItem[];
    avgVideoViews: TagItem[];
    formats: TagItem[];
    categories: TagItem[];
    tones: TagItem[];
    involvements: TagItem[];
    usageRanges: TagItem[];
};

export type MatchesRequest = {
    beauty: {
        interestStyleTags: number[];
        prefferedFunctionTags: number[];
        skinTypeTags: number;
        skinToneTags: number;
        makeupStyleTags: number;
    };
    fashion: {
        interestStyleTags: number[];
        preferredItemTags: number[];
        preferredBrandTags: number[];
        heightTag: number;
        weightTypeTag: number;
        topSizeTag: number;
        bottomSizeTag: number;
    };
    content: {
        sns: {
            url: string;
            mainAudience: {
                genderTags: number[];
                ageTags: number[];
            };
            averageAudience: {
                videoLengthTags: number[];
                videoViewsTags: number[];
            };
        };
        typeTags: number[];
        toneTags: number[];
        prefferedInvolvementTags: number[];
        prefferedCoverageTags: number[];
    };
};

export type MatchedBrand = {
    brandId: number;
    brandName: string;
    matchingRatio: number;
    logoUrl?: string;
};

export type HighMatchingBrandList = {
    count: number;
    brands: MatchedBrand[];
};

export type MatchesResponseResult = {
    userType: string;
    typeTag: string[];
    highMatchingBrandList: HighMatchingBrandList;
};
