import { apiClient } from "../../../api/axios";
import { tokenStorage } from "../../../lib/token";

/** ---------------------------------------
 *  Common response + error helpers
 *  ------------------------------------- */

type ApiErrorData = { code?: string; message?: string };
type ApiErrorResponse = { status: number; data?: ApiErrorData };
type ApiThrown = { response?: ApiErrorResponse };

const isMatchTestNotCompleted = (code?: string, message?: string) => {
  if (code === "MATCH_TEST_NOT_COMPLETED") return true;
  // 메시지 기반 판별은 오탐이 많아서 최소한으로만 사용
  if (!message) return false;
  return message.includes("매칭 테스트") || message.includes("테스트를 먼저");
};

// 커스텀 에러 클래스
export class MatchingTestRequiredError extends Error {
  constructor(message: string = "매칭 검사를 먼저 진행해주세요") {
    super(message);
    this.name = "MatchingTestRequiredError";
  }
}

/** ---------------------------------------
 *  Match analysis
 *  ------------------------------------- */

// 매칭 분석 결과 조회 응답 타입
export interface MatchResult {
  userType: string;
  typeTag: string[];
  highMatchingBrandList?: {
    count: number;
    brands: MatchingBrand[];
  };
}

// 스토어에서 사용하는 타입 (MatchResult와 동일하나 highMatchingBrandList가 필수)
export interface MatchResponseDto {
  userType: string;
  typeTag: string[];
  highMatchingBrandList: {
    count: number;
    brands: { brandId: number; logoUrl?: string; brandName: string }[];
  };
}

interface MatchResultResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MatchResult;
}

/**
 * 매칭 분석 결과 조회
 * Get /api/v1/matches
 */
export const getMatchAnalysis = async (): Promise<MatchResult> => {
  try {
    const userId = tokenStorage.getUserId();
    if (!userId) throw new MatchingTestRequiredError();

    const response =
      await apiClient.get<MatchResultResponse>(`/api/v1/matches`);

    if (!response.data.isSuccess) {
      if (isMatchTestNotCompleted(response.data.code, response.data.message)) {
        throw new MatchingTestRequiredError();
      }
      throw new Error(response.data.message || "매칭 분석 결과 조회 실패");
    }

    return response.data.result;
  } catch (error: unknown) {
    if (error instanceof MatchingTestRequiredError) throw error;

    const axiosError = error as ApiThrown;
    const code = axiosError.response?.data?.code;
    const message = axiosError.response?.data?.message;
    if (isMatchTestNotCompleted(code, message)) {
      throw new MatchingTestRequiredError();
    }

    console.error("매칭 분석 결과 조회 실패:", error);
    throw error;
  }
};

/** ---------------------------------------
 *  Matching list types
 *  ------------------------------------- */

// 매칭 캠페인 응답 타입 (CampaignDto)
// ✅ Home에서 campaignId를 안정적으로 쓰도록 campaignId/brandId를 같이 둠
export interface MatchingCampaign {
  id: number; // CampaignCard 등 기존 호환용
  campaignId?: number;
  brandId?: number;

  brandName: string;
  name?: string;
  title?: string;
  campaignName?: string;
  category: string;

  manuscriptFee?: number; // reward
  reward?: number;

  matchingRatio?: number; // matchRate
  matchRate?: number;

  applicants: number;
  isLiked: boolean;
  logoUrl?: string; // brandLogoUrl
  dDay?: number;
}

// 매칭 브랜드 응답 타입 (BrandDto)
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
    brands: MatchCampaignRawItem[];
    count: number;
  };
}

interface MatchingBrandResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    brands: MatchBrandRawItem[];
    count: number;
  };
}

interface MatchCampaignRawItem {
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

// ✅ 서버 응답 키(brandLogoUrl/brandMatchingRatio/brandIsLike/brandTags)를 반영
interface MatchBrandRawItem {
  brandId: number;
  brandName: string;

  brandLogoUrl?: string;
  brandMatchingRatio?: number;
  brandIsLike?: boolean;
  brandTags?: string[];
  brandIsRecruiting?: boolean;

  // fallback (환경/버전 차이를 대비)
  logoUrl?: string;
  matchingRatio?: number;
  brandIsLiked?: boolean;
  category?: string;
  tags?: string[];
}

/** ---------------------------------------
 *  Brand filter DTOs
 *  ------------------------------------- */

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

/** ---------------------------------------
 *  Matching campaigns
 *  ------------------------------------- */

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
  size: number = 20,
): Promise<{ campaigns: MatchingCampaign[]; count: number }> => {
  try {
    const userId = tokenStorage.getUserId();
    if (!userId) throw new MatchingTestRequiredError();

    const params: Record<string, string | number | string[]> = {
      sortBy,
      category,
      page,
      size,
    };
    if (tags && tags.length > 0) params.tags = tags;
    if (keyword) params.keyword = keyword;

    const response = await apiClient.get<MatchingCampaignResponse>(
      `/api/v1/matches/campaigns`,
      { params },
    );

    if (!response.data.isSuccess) {
      if (isMatchTestNotCompleted(response.data.code, response.data.message)) {
        throw new MatchingTestRequiredError();
      }
      throw new Error(response.data.message || "캠페인 목록 조회 실패");
    }

    const campaigns = (response.data.result.brands || []).map((item) => {
      const campaignId = item.campaignId ?? 0;

      return {
        // ✅ 기존 호환: id는 "campaignId" 우선 (brandId 우선이면 상세/좋아요가 깨짐)
        id: campaignId || 0,
        campaignId: item.campaignId,
        brandId: item.brandId,

        brandName: item.brandName,
        name: item.campaignName || item.campaignDetail,
        title: item.campaignName || item.campaignDetail,
        campaignName: item.campaignName,

        category,

        manuscriptFee: item.campaignManuscriptFee,
        reward: item.campaignManuscriptFee,

        matchingRatio: item.brandMatchingRatio || 0,
        matchRate: item.brandMatchingRatio || 0,

        // NOTE: 기존 코드 유지 (필요하면 currentRecruit로 바꾸기)
        applicants: item.campaignTotalRecruit || 0,

        isLiked: item.brandIsLiked || false,
        logoUrl: item.brandLogoUrl,
        dDay: item.campaignDDay,
      };
    });

    return {
      campaigns,
      count: response.data.result.count || 0,
    };
  } catch (error: unknown) {
    if (error instanceof MatchingTestRequiredError) throw error;

    const axiosError = error as ApiThrown;
    const code = axiosError.response?.data?.code;
    const message = axiosError.response?.data?.message;
    if (isMatchTestNotCompleted(code, message)) {
      throw new MatchingTestRequiredError();
    }

    console.error("매칭 캠페인 조회 실패:", error);
    throw error;
  }
};

/** ---------------------------------------
 *  Matching brands
 *  ------------------------------------- */

/**
 * 매칭 브랜드 목록 조회
 * @param sortBy 정렬 기준 (MATCH_SCORE, POPULARITY, NEWEST)
 * @param category 카테고리 필터 (ALL, FASHION, BEAUTY)
 * @param tags 태그 필터
 */
export const getMatchingBrands = async (
  sortBy: string = "MATCH_SCORE",
  category: string = "ALL",
  tags?: string[],
): Promise<{ brands: MatchingBrand[]; count: number }> => {
  try {
    const userId = tokenStorage.getUserId();
    if (!userId) throw new MatchingTestRequiredError();

    const params: Record<string, string | number | string[]> = {
      sortBy,
      category,
    };
    if (tags && tags.length > 0) params.tags = tags;

    const response = await apiClient.get<MatchingBrandResponse>(
      `/api/v1/matches/brands`,
      { params },
    );

    if (!response.data.isSuccess) {
      if (isMatchTestNotCompleted(response.data.code, response.data.message)) {
        throw new MatchingTestRequiredError();
      }
      throw new Error(response.data.message || "브랜드 목록 조회 실패");
    }

    // ✅ 서버 응답 키 mismatch 해결: brandLogoUrl/brandMatchingRatio/brandIsLike/brandTags
    const brands = (response.data.result.brands || []).map((item) => {
      const matchingRatio = item.brandMatchingRatio ?? item.matchingRatio ?? 0;

      return {
        id: item.brandId,
        name: item.brandName,

        logoUrl: item.brandLogoUrl ?? item.logoUrl,

        matchRate: matchingRatio,
        matchingRatio,

        isLiked: item.brandIsLike ?? item.brandIsLiked ?? false,

        category: item.category || category,

        tags: item.brandTags ?? item.tags ?? [],
      };
    });

    return {
      brands,
      count: response.data.result.count || 0,
    };
  } catch (error: unknown) {
    if (error instanceof MatchingTestRequiredError) throw error;

    // ✅ 여기서 400/404를 매칭테스트 미완료로 뭉뚱그리면 디버깅이 막힘
    const axiosError = error as ApiThrown;
    const status = axiosError.response?.status;
    const code = axiosError.response?.data?.code;
    const message = axiosError.response?.data?.message;

    if (isMatchTestNotCompleted(code, message)) {
      throw new MatchingTestRequiredError();
    }

    // 인증 문제는 원인 파악이 쉽도록 분리
    if (status === 401 || status === 403) {
      throw new Error("로그인이 필요하거나 권한이 없습니다.");
    }

    console.error("매칭 브랜드 조회 실패:", {
      status,
      code,
      message,
      raw: axiosError.response?.data,
    });
    throw error;
  }
};

/** ---------------------------------------
 *  Brand filters
 *  ------------------------------------- */

/**
 * 브랜드 필터 옵션 조회
 */
export const getBrandFilters = async (): Promise<BrandFilterResponseDto[]> => {
  try {
    const response = await apiClient.get<BrandFilterResponse>(
      "/api/v1/brands/filters",
    );

    if (!response.data.isSuccess) {
      throw new Error(response.data.message || "브랜드 필터 조회 실패");
    }

    return response.data.result || [];
  } catch (error: unknown) {
    console.error("브랜드 필터 조회 실패:", error);
    throw error;
  }
};

/** ---------------------------------------
 *  Brand like
 *  ------------------------------------- */

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

export const toggleBrandLike = async (brandId: number): Promise<boolean> => {
  try {
    const response = await apiClient.post<BrandLikeResponse>(
      `/api/v1/brands/${brandId}/like`,
      {}, // 빈 객체 body 추가
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

/** ---------------------------------------
 *  Tag names (stub)
 *  ------------------------------------- */

/**
 * 카테고리별 태그 이름 가져오기
 * @returns 태그 이름 배열
 */
export const getTagNamesByCategory = async (): Promise<string[]> => {
  return [];
};

/** ---------------------------------------
 *  Campaign proposal
 *  ------------------------------------- */

export interface CreateCampaignProposalRequest {
  brandId: number;
  creatorId: number;
  campaignId: number | null;
  campaignName: string;
  description: string;
  formats: { id: string }[];
  categories: { id: string }[];
  tones: { id: string }[];
  involvements: { id: string }[];
  usageRanges: { id: string }[];
  rewardAmount: number;
  productId: number;
  startDate: string;
  endDate: string;
}

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
export const createCampaignProposal = async (
  data: CreateCampaignProposalRequest,
): Promise<number> => {
  try {
    const response = await apiClient.post<CreateCampaignProposalResponse>(
      "/api/v1/campaigns/proposal",
      data,
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

/** ---------------------------------------
 *  Match test request
 *  ------------------------------------- */

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

/**
 * 매칭 테스트 결과 분석 요청
 * POST /api/v1/matches
 */
export const analyzeMatch = async (
  data: MatchRequestDto,
): Promise<MatchResult> => {
  try {
    const response = await apiClient.post<MatchResultResponse>(
      "/api/v1/matches",
      data,
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
