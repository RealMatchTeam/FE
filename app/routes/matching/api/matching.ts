import { apiClient } from "../../../api/axios";
import { tokenStorage } from "../../../lib/token";

// 매칭 캠페인 응답 타입
export interface MatchingCampaign {
  id: number;
  brandName: string;
  name?: string;
  title?: string;
  category: string;
  manuscriptFee?: number;
  reward?: number;
  matchingRatio?: number;
  matchRate?: number;
  applicants: number;
  isLiked: boolean;
  logoUrl?: string;
}

// 매칭 브랜드 응답 타입
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

interface MatchingCampaignResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    campaigns: MatchingCampaign[];
  };
}

interface MatchingBrandResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    brands: MatchingBrand[];
  };
}

// 브랜드 필터 타입
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

interface BrandFilterResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: BrandFilterResponseDto[];
}

// 커스텀 에러 클래스
export class MatchingTestRequiredError extends Error {
  constructor(message: string = "매칭 검사를 먼저 진행해주세요") {
    super(message);
    this.name = "MatchingTestRequiredError";
  }
}

/**
 * 매칭 캠페인 목록 조회
 * @param sortBy 정렬 기준 (MATCH_SCORE, POPULARITY, NEWEST)
 * @param category 카테고리 필터 (ALL, FASHION, BEAUTY)
 * @param tags 태그 필터
 */
export const getMatchingCampaigns = async (
  sortBy: string = "MATCH_SCORE",
  category: string = "ALL",
  tags?: string[]
): Promise<MatchingCampaign[]> => {
  try {
    const userId = tokenStorage.getUserId();
    if (!userId) {
      throw new MatchingTestRequiredError();
    }

    const params: any = { sortBy, category };
    if (tags && tags.length > 0) {
      params.tags = tags;
    }

    const response = await apiClient.get<MatchingCampaignResponse>(
      `/api/v1/matches/campaigns`,
      { params }
    );

    if (!response.data.isSuccess) {
      // 매칭 테스트 미완료 에러 체크
      if (response.data.code === "MATCH_TEST_NOT_COMPLETED" ||
          response.data.message.includes("매칭") ||
          response.data.message.includes("테스트")) {
        throw new MatchingTestRequiredError();
      }
      throw new Error(response.data.message || "캠페인 목록 조회 실패");
    }

    return response.data.result.campaigns || [];
  } catch (error: any) {
    // MatchingTestRequiredError는 그대로 throw
    if (error instanceof MatchingTestRequiredError) {
      throw error;
    }

    // 404 에러나 기타 에러 시 매칭 검사 필요 메시지
    if (error.response?.status === 404 ||
        error.response?.status === 400 ||
        error.response?.data?.message?.includes("매칭") ||
        error.response?.data?.message?.includes("테스트")) {
      throw new MatchingTestRequiredError();
    }

    console.error("매칭 캠페인 조회 실패:", error);
    throw error;
  }
};

/**
 * 매칭 브랜드 목록 조회
 * @param sortBy 정렬 기준 (MATCH_SCORE, POPULARITY, NEWEST)
 * @param category 카테고리 필터 (ALL, FASHION, BEAUTY)
 * @param tags 태그 필터
 */
export const getMatchingBrands = async (
  sortBy: string = "MATCH_SCORE",
  category: string = "ALL",
  tags?: string[]
): Promise<MatchingBrand[]> => {
  try {
    const userId = tokenStorage.getUserId();
    if (!userId) {
      throw new MatchingTestRequiredError();
    }

    const params: any = { sortBy, category };
    if (tags && tags.length > 0) {
      params.tags = tags;
    }

    const response = await apiClient.get<MatchingBrandResponse>(
      `/api/v1/matches/brands`,
      { params }
    );

    if (!response.data.isSuccess) {
      // 매칭 테스트 미완료 에러 체크
      if (response.data.code === "MATCH_TEST_NOT_COMPLETED" ||
          response.data.message.includes("매칭") ||
          response.data.message.includes("테스트")) {
        throw new MatchingTestRequiredError();
      }
      throw new Error(response.data.message || "브랜드 목록 조회 실패");
    }

    return response.data.result.brands || [];
  } catch (error: any) {
    // MatchingTestRequiredError는 그대로 throw
    if (error instanceof MatchingTestRequiredError) {
      throw error;
    }

    // 404 에러나 기타 에러 시 매칭 검사 필요 메시지
    if (error.response?.status === 404 ||
        error.response?.status === 400 ||
        error.response?.data?.message?.includes("매칭") ||
        error.response?.data?.message?.includes("테스트")) {
      throw new MatchingTestRequiredError();
    }

    console.error("매칭 브랜드 조회 실패:", error);
    throw error;
  }
};

/**
 * 브랜드 필터 옵션 조회
 */
export const getBrandFilters = async (): Promise<BrandFilterResponseDto[]> => {
  try {
    const response = await apiClient.get<BrandFilterResponse>('/api/v1/brands/filters');

    if (!response.data.isSuccess) {
      throw new Error(response.data.message || "브랜드 필터 조회 실패");
    }

    return response.data.result || [];
  } catch (error: any) {
    console.error("브랜드 필터 조회 실패:", error);
    throw error;
  }
};

// 브랜드 좋아요 응답 타입
export interface BrandLikeResponseDto {
  brandIsLiked: boolean;
}

interface BrandLikeResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: BrandLikeResponseDto[];
}

/**
 * 브랜드 좋아요 토글
 * @param brandId 브랜드 ID
 */
export const toggleBrandLike = async (brandId: number): Promise<boolean> => {
  try {
    const response = await apiClient.post<BrandLikeResponse>(
      `/api/v1/brands/${brandId}/like`
    );

    if (!response.data.isSuccess) {
      throw new Error(response.data.message || "브랜드 좋아요 토글 실패");
    }

    // 응답이 배열 형태이므로 첫 번째 요소의 brandIsLiked 반환
    return response.data.result[0]?.brandIsLiked || false;
  } catch (error: any) {
    console.error("브랜드 좋아요 토글 실패:", error);
    throw error;
  }
};
