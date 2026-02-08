import { axiosInstance } from "../../../../api/axios";

export interface CampaignCollaboration {
  campaignId: number;
  proposalId: string | null;
  brandName: string;
  thumbnailUrl: string;
  title: string;
  status: "NONE" | "REVIEWING" | "MATCHED" | "REJECTED";
  startDate: string; 
  endDate: string;
  keyword?: string;
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

  const response = await axiosInstance.get<CollaborationResponse>(
    "/v1/campaigns/collaborations/me",
    { params }
  );
  return response.data.result;
};

// 협업 캠페인 검색 API
export const searchCollaborations = async (params: {
  keyword?: string;
  type: "APPLIED" | "SENT" | "RECEIVED";
  status?: "CANCELED" | "NONE" | "REVIEWING" | "MATCHED" | "REJECTED";
}) => {
  const response = await axiosInstance.get<CollaborationResponse>(
    "/v1/campaigns/collaborations/search",
    { params }
  );
  return response.data.result;
};