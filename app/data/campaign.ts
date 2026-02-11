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

import { apiClient } from "../api/axios";

// 상세 정보 내 태그 아이템 타입
export interface TagItem {
  id: string;
  name: string;
}

// 스웨거 명세 기반 상세 데이터 타입
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

// API 응답 구조
interface ProposalResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ProposalDetail;
}

// 상세 조회 API 호출 함수
export const getProposalDetail = async (id: string): Promise<ProposalDetail> => {
  const response = await apiClient.get<ProposalResponse>(`/api/v1/campaigns/${id}`);

  console.log("API 전체 응답:", response.data);

  return response.data.result;
};

export interface CampaignCollaboration {
  campaignId: number;
  proposalId: string | null;
  brandName: string;
  thumbnailUrl: string;
  title: string;
  status: "NONE" | "REVIEWING" | "MATCHED" | "REJECTED";
  startDate: string;
  endDate: string;
  type: "APPLIED" | "SENT" | "RECEIVED";
}