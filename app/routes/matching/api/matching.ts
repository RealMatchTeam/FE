import { apiClient } from "../../../api/axios";
import type { MatchResult, MatchRequestDto } from "../../../types/matching";
import type { MatchingBrand, BrandLikeResponseDto } from "../../../types/brand";
import type { MatchingCampaign, CreateCampaignProposalRequest } from "../../../types/campaign";
import type { ApiResponse } from "../../../types/common";

type MatchResultResponse = ApiResponse<MatchResult>;

/**
 * 매칭 분석 결과 조회
 * Get /api/v1/matches
 */
export const getMatchAnalysis = async (): Promise<MatchResult> => {
  try {

    const response = await apiClient.get<MatchResultResponse>(`/api/v1/matches`);

    if (!response.data.isSuccess) {
      // 매칭 테스트 미완료 에러 체크
      if (response.data.code === "MATCH_TEST_NOT_COMPLETED" ||
        response.data.message.includes("매칭") ||
        response.data.message.includes("테스트")) {
        throw new MatchingTestRequiredError();
      }
      throw new Error(response.data.message || "매칭 분석 결과 조회 실패");
    }

    return response.data.result;
  } catch (error: unknown) {
    if (error instanceof MatchingTestRequiredError) {
      throw error;
    }
    console.error("매칭 분석 결과 조회 실패:", error);
    throw error;
  }
};

import type {
  MatchCampaignRawItem,
  MatchBrandRawItem,
  BrandFilterResponseDto
} from "../../../types/matching";

type MatchingCampaignResponse = ApiResponse<{
  brands: MatchCampaignRawItem[];
  count: number;
}>;

type MatchingBrandResponse = ApiResponse<{
  brands: MatchBrandRawItem[];
  count: number;
}>;

type BrandFilterResponse = ApiResponse<BrandFilterResponseDto[]>;


// 커스텀 에러 클래스
export class MatchingTestRequiredError extends Error {
  constructor(message: string = "매칭 검사를 먼저 진행해주세요") {
    super(message);
    this.name = "MatchingTestRequiredError";
  }
}

/**
 * 매칭 캠페인 목록 조회
 * @param sortBy 정렬 기준 (MATCH_SCORE, POPULARITY, REWARD_AMOUNT, D_DAY)
 * @param category 카테고리 필터 (ALL, FASHION, BEAUTY)
 * @param tags 태그 필터
 * @param keyword 검색 키워드 (캠페인명 검색)
 * @param page 페이지 번호 (0부터 시작)
 * @param size 페이지 크기 (기본 20)
 */
export const getMatchingCampaigns = async (
  sortBy: string = "MATCH_SCORE",
  category: string = "ALL",
  tags?: string[],
  keyword?: string,
  page: number = 0,
  size: number = 20
): Promise<{ campaigns: MatchingCampaign[]; count: number }> => {
  try {

    const params: Record<string, string | number | string[]> = {
      sortBy,
      category,
      page,
      size
    };

    if (tags && tags.length > 0) {
      params.tags = tags;
    }

    if (keyword) {
      params.keyword = keyword;
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

    // API 응답 필드를 인터페이스 형식으로 변환
    const campaigns: MatchingCampaign[] = (response.data.result.brands || []).map((item: MatchCampaignRawItem) => ({
      id: item.brandId || item.campaignId || 0,
      brandName: item.brandName,
      name: item.campaignName || item.campaignDetail,
      title: item.campaignName || item.campaignDetail,
      campaignName: item.campaignName,
      category: category,
      manuscriptFee: item.campaignManuscriptFee,
      reward: item.campaignManuscriptFee,
      matchingRatio: item.brandMatchingRatio || 0,
      matchRate: item.brandMatchingRatio || 0,
      applicants: item.campaignTotalRecruit || 0,
      isLiked: item.brandIsLiked || false,
      logoUrl: item.brandLogoUrl,
      dDay: item.campaignDDay
    }));


    return {
      campaigns,
      count: response.data.result.count || 0
    };
  } catch (error: unknown) {
    if (error instanceof MatchingTestRequiredError) {
      throw error;
    }

    const axiosError = error as { response?: { status: number; data?: { message?: string } } };
    if (axiosError.response?.status === 404 ||
      axiosError.response?.status === 400 ||
      axiosError.response?.data?.message?.includes("매칭") ||
      axiosError.response?.data?.message?.includes("테스트")) {
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
): Promise<{ brands: MatchingBrand[]; count: number }> => {
  try {
    const params: Record<string, string | number | string[]> = { sortBy, category };
    if (tags && tags.length > 0) {
      params.tags = tags;
    }

    const response = await apiClient.get<MatchingBrandResponse>(
      `/api/v1/matches/brands`,
      { params }
    );

    if (!response.data.isSuccess) {
      if (response.data.code === "MATCH_TEST_NOT_COMPLETED" ||
        response.data.message.includes("매칭") ||
        response.data.message.includes("테스트")) {
        throw new MatchingTestRequiredError();
      }
      throw new Error(response.data.message || "브랜드 목록 조회 실패");
    }

    const brands: MatchingBrand[] = (response.data.result.brands || []).map((item: MatchBrandRawItem) => ({
      id: item.brandId,
      name: item.brandName,
      logoUrl: item.logoUrl || item.brandLogoUrl,
      matchRate: item.matchingRatio || item.brandMatchingRatio || 0,
      matchingRatio: item.matchingRatio || item.brandMatchingRatio,
      isLiked: item.brandIsLiked || false,
      category: item.category || category,
      tags: item.tags || item.brandTags || []
    }));


    return {
      brands,
      count: response.data.result.count || 0
    };
  } catch (error: unknown) {
    if (error instanceof MatchingTestRequiredError) {
      throw error;
    }

    const axiosError = error as { response?: { status: number; data?: { message?: string } } };
    if (axiosError.response?.status === 404 ||
      axiosError.response?.status === 400 ||
      axiosError.response?.data?.message?.includes("매칭") ||
      axiosError.response?.data?.message?.includes("테스트")) {
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
  } catch (error: unknown) {
    console.error("브랜드 필터 조회 실패:", error);
    throw error;
  }
};

type BrandLikeResponse = ApiResponse<BrandLikeResponseDto[]>;


export const toggleBrandLike = async (brandId: number): Promise<boolean> => {
  try {
    const response = await apiClient.post<BrandLikeResponse>(
      `/api/v1/brands/${brandId}/like`,
      {} // 빈 객체 body 추가
    );

    if (!response.data.isSuccess) {
      throw new Error(response.data.message || "브랜드 좋아요 토글 실패");
    }

    // 응답이 배열 형태이므로 첫 번째 요소의 brandIsLiked 반환
    return response.data.result[0]?.brandIsLiked || false;
  } catch (error: unknown) {
    console.error("브랜드 좋아요 토글 실패:", error);
    throw error;
  }
};

/**
 * 카테고리별 태그 이름 가져오기
 * @param category 카테고리 (BEAUTY, FASHION 등)
 * @returns 태그 이름 배열
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getTagNamesByCategory = async (_category: string): Promise<string[]> => {
  // 카테고리별로 기본 태그를 반환하여 모든 태그 포함
  // 실제로는 API에서 카테고리별 태그를 가져와야 할 수 있음
  return [];
};

// 캠페인 제안 응답 타입
interface CreateCampaignProposalResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    proposalId: number;
  };
}

/**
 * 캠페인 제안하기 (역제안)
 */
export const createCampaignProposal = async (data: CreateCampaignProposalRequest): Promise<number> => {
  try {
    const response = await apiClient.post<CreateCampaignProposalResponse>(
      "/api/v1/campaigns/proposal",
      data
    );

    if (!response.data.isSuccess) {
      throw new Error(response.data.message || "캠페인 제안에 실패했습니다.");
    }

    return response.data.result.proposalId;
  } catch (error: unknown) {
    console.error("캠페인 제안 실패:", error);
    throw error;
  }
};

/**
 * 매칭 테스트 결과 분석 요청
 * POST /api/v1/matches
 */
export const analyzeMatch = async (data: MatchRequestDto): Promise<MatchResult> => {
  try {
    const response = await apiClient.post<MatchResultResponse>(
      "/api/v1/matches",
      data
    );

    if (!response.data.isSuccess) {
      throw new Error(response.data.message || "매칭 분석 요청 실패");
    }

    return response.data.result;
  } catch (error: unknown) {
    console.error("매칭 분석 요청 실패:", error);
    throw error;
  }
};
