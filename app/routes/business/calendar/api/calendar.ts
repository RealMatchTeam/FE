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