import { axiosInstance } from "../../../../api/axios";
import type { BrandDetail } from "../../../../types/brand";

// 1. 응답 데이터의 공통 포맷 정의 (isSuccess 등을 포함)
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

import type { ProposalDetail, ProposalResponse } from "../../../../types/campaign";

export const getProposalDetail = async (proposalId: string): Promise<ProposalDetail> => {
  const response = await axiosInstance.get<ProposalResponse>(`/api/v1/campaigns/${proposalId}`);
  return response.data.result;
};

// 브랜드 상세 정보를 가져오는 API 함수
export const getBrandDetail = async (brandId: number | string): Promise<BrandDetail> => {
  const response = await axiosInstance.get<ApiResponse<BrandDetail[]>>(`/api/v1/brands/${brandId}`);
  // 스웨거 응답 구조상 result가 배열이므로 첫 번째 요소를 반환
  return response.data.result[0];
};