export type BrandCategory = "BEAUTY" | "FASHION";

export interface Brand {
    id: number;
    name: string;
    matchRate: number;
    tags: string[];
    isLiked: boolean;
    logoUrl?: string;
    category: BrandCategory;
}

// 캠페인 보기에서 사용하는 브랜드
export interface BrandDetail {
    brandName: string;
    brandTag: string[];
    brandDescription: string;
    brandMatchingRatio: number;
    brandIsLiked: boolean;
    brandCategory: string[];
}

export interface BrandResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: BrandDetail[];
}
