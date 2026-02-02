import axios from "axios";
import { tokenStorage } from "../../../../lib/token";
import type { BrandDetail } from "../../../../data/brand";

// 1. 응답 데이터의 공통 포맷 정의 (isSuccess 등을 포함)
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface ProposalDetail {
  proposalId: number;
  brandId: number;
  creatorId: number;
  title: string;
  description: string;
  rewardAmount: number;
  productId: number;
  startDate: string;
  endDate: string;
  status: string;
  refusalReason: string | null;
  contentTags: {
    formats: { id: number; name: string }[];
    categories: { id: number; name: string }[];
    tones: { id: number; name: string }[];
    involvements: { id: number; name: string }[];
    usageRanges: { id: number; name: string }[];
  };
}

export const getProposalDetail = async (proposalId: string): Promise<ProposalDetail> => {
  const BASE_URL = "https://api.realmatch.co.kr";
  // 1. tokenStorage 유틸을 사용하여 안전하게 토큰을 가져옵니다.
  const token = tokenStorage.getAccessToken();

  console.log("현재 보관된 토큰:", token);
  console.log("토큰 만료 여부:", tokenStorage.isTokenExpired());
  console.log("현재 사용자 ID:", tokenStorage.getUserId());
  console.log("현재 사용자 역할(Role):", tokenStorage.getRole());

  try {
    const response = await axios.get(`${BASE_URL}/api/v1/campaigns/proposal/${proposalId}`, {
      headers: {
        // 2. 토큰이 있을 때만 Authorization 헤더를 추가합니다.
        ...(token && { Authorization: `Bearer ${token}` }),
        "accept": "*/*"
      }
    });

    if (response.data.isSuccess) {
      return response.data.result;
    }


    throw new Error(response.data.message || "데이터 로드 실패");
  } catch (error) { // : any 삭제
    if (axios.isAxiosError(error)) { // axios 에러인지 확인하는 가드 추가 (권장)
      if (error.response?.status === 401) {
        console.error("401 에러: 토큰이 유효하지 않거나 로그인이 필요합니다.");
      }

    }
    throw error;
  }
};

// 브랜드 상세 정보를 가져오는 API 함수 예시
export const getBrandDetail = async (brandId: number | string): Promise<BrandDetail> => {
  const BASE_URL = "https://api.realmatch.co.kr";
  const token = tokenStorage.getAccessToken();

  try {
    const response = await axios.get(`${BASE_URL}/api/v1/brands/${brandId}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        "accept": "*/*"
      }
    });

    if (response.data.isSuccess) {
      // 스웨거 응답 구조상 result가 배열이므로 첫 번째 요소를 반환
      return response.data.result[0];
    }

    throw new Error(response.data.message || "브랜드 정보 로드 실패");
  } catch (error) {

    console.error("브랜드 상세 조회 실패:", error);
    throw error;
  }
};