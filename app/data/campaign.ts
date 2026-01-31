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

export const CAMPAIGN_DATA: Campaign[] = [
  // 뷰티 캠페인
  {
    id: 1,
    brandName: "비플레인",
    title: "'글로우업' 선크림 신제품 홍보",
    reward: 100000,
    matchRate: 98,
    dDay: 5,
    applicants: 25,
    isLiked: false,
    category: "BEAUTY"
  },
  {
    id: 2,
    brandName: "라운드랩",
    title: "자작나무 수분크림 체험단",
    reward: 80000,
    matchRate: 92,
    dDay: 3,
    applicants: 42,
    isLiked: true,
    category: "BEAUTY"
  },
  {
    id: 3,
    brandName: "이즈앤트리",
    title: "비타민C 세럼 리뷰 캠페인",
    reward: 120000,
    matchRate: 85,
    dDay: 7,
    applicants: 18,
    isLiked: false,
    category: "BEAUTY"
  },
  // 패션 캠페인
  {
    id: 4,
    brandName: "무신사 스탠다드",
    title: "2025 S/S 신상 룩북 촬영",
    reward: 150000,
    matchRate: 95,
    dDay: 10,
    applicants: 56,
    isLiked: false,
    category: "FASHION"
  },
  {
    id: 5,
    brandName: "디스이즈네버댓",
    title: "스트릿 패션 착용샷 모집",
    reward: 90000,
    matchRate: 88,
    dDay: 2,
    applicants: 31,
    isLiked: true,
    category: "FASHION"
  },
  {
    id: 6,
    brandName: "커버낫",
    title: "봄 신상 코디 콘텐츠 제작",
    reward: 110000,
    matchRate: 82,
    dDay: 6,
    applicants: 22,
    isLiked: false,
    category: "FASHION"
  },
];

import { apiClient } from "../lib/api-client"; //

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
  const response = await apiClient.get<ProposalResponse>(`/api/v1/campaigns/proposal/${id}`);

  console.log("API 전체 응답:", response.data);

  return response.data.result;
};