import { axiosInstance } from "../../../../api/axios";

export interface CampaignCollaboration {
  campaignId: number;
  proposalId: string | null;
  brandName: string;
  thumbnailUrl: string;
  title: string;
  status: "NONE" | "REVIEWING" | "MATCHED" | "REJECTED";
  startDate: string; // "2026-02-01"
  endDate: string;
  type: "APPLIED" | "SENT" | "RECEIVED";
}

interface CollaborationResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: CampaignCollaboration[];
}

// 협업 내역 조회 API
export const getMyCollaborations = async (params?: {
  type?: "APPLIED" | "SENT" | "RECEIVED";
  status?: "NONE" | "REVIEWING" | "MATCHED" | "REJECTED";
  startDate?: string;
  endDate?: string;
}) => {
  // axios -> axiosInstance로 수정
  const response = await axiosInstance.get<CollaborationResponse>(
    "/api/v1/campaigns/collaborations/me",
    { params }
  );
  return response.data.result;
};

export const MATCHING_DUMMY_DATA: CampaignCollaboration[] = [
  {
    campaignId: 1,
    proposalId: "p1",
    brandName: "라운드랩",
    thumbnailUrl: "", 
    title: "자작나무 수분크림 체험단",
    status: "MATCHED",
    startDate: "2026-02-02",
    endDate: "2026-02-07",
    type: "SENT",
  },
  {
    campaignId: 2,
    proposalId: "p2",
    brandName: "비플레인",
    thumbnailUrl: "",
    title: "'글로우업' 선크림 신제품 홍보",
    status: "REVIEWING",
    startDate: "2026-02-04",
    endDate: "2025-02-05",
    type: "RECEIVED",
  },
  {
    campaignId: 3,
    proposalId: "p3",
    brandName: "그레이스유",
    thumbnailUrl: "",
    title: "봄 신상 코디 콘텐츠 제작",
    status: "REVIEWING",
    startDate: "2026-02-23",
    endDate: "2026-02-24",
    type: "RECEIVED",
  },
  {
    campaignId: 4,
    proposalId: "p4",
    brandName: "이즈앤트리",
    thumbnailUrl: "",
    title: "비타민C 세럼 리뷰 캠페인",
    status: "REJECTED",
    startDate: "2026-02-01",
    endDate: "2025-02-04",
    type: "SENT",
  },
];
