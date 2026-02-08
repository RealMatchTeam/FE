import { apiClient } from "../../../api/axios";
import { tokenStorage } from "../../../lib/token";

type ApiErrorData = { code?: string; message?: string };
type ApiErrorResponse = { status: number; data?: ApiErrorData };
type ApiThrown = { response?: ApiErrorResponse };

const isMatchTestNotCompleted = (code?: string, message?: string) => {
  if (code === "MATCH_TEST_NOT_COMPLETED") return true;
  if (!message) return false;
  return message.includes("매칭 테스트") || message.includes("테스트를 먼저");
};

export class MatchingTestRequiredError extends Error {
  constructor(message: string = "매칭 검사를 먼저 진행해주세요") {
    super(message);
    this.name = "MatchingTestRequiredError";
  }
}

export interface MatchResult {
  userType: string;
  typeTag: string[];
  highMatchingBrandList?: {
    count: number;
    brands: MatchingBrand[];
  };
}

export interface MatchResponseDto {
  userName: string;
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

export const getMatchAnalysis = async (): Promise<MatchResult> => {
  try {
    const userId = tokenStorage.getUserId();
    if (!userId) throw new MatchingTestRequiredError();

    const response = await apiClient.get<MatchResultResponse>(`/v1/matches`);

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

export interface MatchingCampaign {
  id: number;
  campaignId?: number;
  brandId?: number;

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

export interface MatchingBrand {
  id: number;
  name: string;
  logoUrl?: string;
  matchRate: number;
  matchingRatio?: number;
  isLiked: boolean;
  category: string;
  tags?: string[];
  isRecruiting?: boolean;
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

interface MatchBrandRawItem {
  brandId: number;
  brandName: string;

  brandLogoUrl?: string;
  brandMatchingRatio?: number;
  brandIsLike?: boolean;
  brandTags?: string[];
  logoUrl?: string;
  matchingRatio?: number;

  brandIsLiked?: boolean;
  brandIsRecruiting?: boolean;

  category?: string;
  tags?: string[];
}

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
      `/v1/matches/campaigns`,
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
      `/v1/matches/brands`,
      { params },
    );

    if (!response.data.isSuccess) {
      if (isMatchTestNotCompleted(response.data.code, response.data.message)) {
        throw new MatchingTestRequiredError();
      }
      throw new Error(response.data.message || "브랜드 목록 조회 실패");
    }

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
        isRecruiting: item.brandIsRecruiting ?? false,
      };
    });

    return {
      brands,
      count: response.data.result.count || 0,
    };
  } catch (error: unknown) {
    if (error instanceof MatchingTestRequiredError) throw error;

    const axiosError = error as ApiThrown;
    const status = axiosError.response?.status;
    const code = axiosError.response?.data?.code;
    const message = axiosError.response?.data?.message;

    if (isMatchTestNotCompleted(code, message)) {
      throw new MatchingTestRequiredError();
    }

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

export const getBrandFilters = async (): Promise<BrandFilterResponseDto[]> => {
  try {
    const response =
      await apiClient.get<BrandFilterResponse>("/v1/brands/filters");

    if (!response.data.isSuccess) {
      throw new Error(response.data.message || "브랜드 필터 조회 실패");
    }

    return response.data.result || [];
  } catch (error: unknown) {
    console.error("브랜드 필터 조회 실패:", error);
    throw error;
  }
};

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
  const response = await apiClient.post<BrandLikeResponse>(
    `/v1/brands/${brandId}/like`,
    {},
  );

  if (!response.data?.isSuccess) {
    throw new Error(response.data?.message || "브랜드 좋아요 토글 실패");
  }

  const r: unknown = response.data.result;

  if (typeof r === "boolean") return r;

  if (typeof r === "object" && r !== null) {
    if (
      "brandIsLiked" in r &&
      typeof (r as { brandIsLiked?: unknown }).brandIsLiked === "boolean"
    ) {
      return (r as { brandIsLiked: boolean }).brandIsLiked;
    }
    if (
      "isLiked" in r &&
      typeof (r as { isLiked?: unknown }).isLiked === "boolean"
    ) {
      return (r as { isLiked: boolean }).isLiked;
    }
  }

  if (
    Array.isArray(r) &&
    r[0] &&
    typeof r[0] === "object" &&
    "brandIsLiked" in (r[0] as object) &&
    typeof (r[0] as { brandIsLiked?: unknown }).brandIsLiked === "boolean"
  ) {
    return (r[0] as { brandIsLiked: boolean }).brandIsLiked;
  }

  console.warn("Unexpected toggleBrandLike result shape:", r);
  return false;
};

export const getTagNamesByCategory = async (): Promise<string[]> => {
  return [];
};

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

export const createCampaignProposal = async (
  data: CreateCampaignProposalRequest,
): Promise<number> => {
  try {
    const response = await apiClient.post<CreateCampaignProposalResponse>(
      "/v1/campaigns/proposal",
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

export const analyzeMatch = async (
  data: MatchRequestDto,
): Promise<MatchResult> => {
  try {
    const response = await apiClient.post<MatchResultResponse>(
      "/v1/matches",
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

interface CampaignLikeResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: string;
}

export const toggleCampaignLike = async (
  campaignId: number,
): Promise<string> => {
  const response = await apiClient.post<CampaignLikeResponse>(
    `/v1/campaigns/${campaignId}/like`,
    {},
  );

  if (!response.data?.isSuccess) {
    throw new Error(response.data?.message || "캠페인 좋아요 토글 실패");
  }

  return response.data.result;
};
