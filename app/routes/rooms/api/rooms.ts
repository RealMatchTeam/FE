import { axiosInstance } from "../../../api/axios";

//채팅룸 상세조회

export interface ChatRoomDetailResponse {
  roomId: number;
  opponentUserId: number;
  opponentName: string;
  opponentProfileImageUrl: string | null;
  isCollaborating: boolean;
  campaignSummary: CampaignSummary | null;
}

export interface CampaignSummary {
  campaignId: number;
  campaignImageUrl: string | null;
  brandName: string;
  campaignTitle: string;
}

export async function getChatRoomDetail(roomId: number): Promise<ChatRoomDetailResponse> {
  const res = await axiosInstance.get<ChatRoomDetailResponse>(`/api/v1/chat/rooms/${roomId}`);
  return res.data;
}

//채팅 메시지 목록 조회

export interface ChatMessageListResponse {
  messages: ChatMessage[];
  nextCursor: string | null;
  hasNext: boolean;
}

export interface ChatMessage {
  messageId: number;
  roomId: number;
  senderId: number | null; // 시스템 메시지는 null
  senderType: "USER" | "SYSTEM";
  messageType: "TEXT" | "IMAGE" | "FILE" | "SYSTEM";
  content: string | null; // TEXT일 때만
  attachment: ChatAttachment | null; // IMAGE/FILE일 때만
  systemMessage: SystemMessage | null; // SYSTEM일 때만
  createdAt: string; // ISO-8601 형식
  clientMessageId: string | null; // 사용자가 보낸 메시지의 UUID
}

export interface ChatAttachment {
  attachmentId: number;
  attachmentType: "IMAGE" | "FILE";
  contentType: string;
  originalName: string;
  fileSize: number;
  accessUrl: string | null; // Presigned URL. null이면 에러 토스트 등 처리 필요
  status: "UPLOADED" | "READY" | "FAILED"; // READY만 채팅 메시지 첨부 가능
}

export interface SystemMessage {
  schemaVersion: number;
  kind: "PROPOSAL_CARD" | "PROPOSAL_STATUS_NOTICE" | "MATCHED_CAMPAIGN_CARD";
  payload: any; // kind에 따라 다른 구조
}

type GetChatMessagesParams = {
  roomId: number;
  cursor?: string; 
  size?: number;  
};

export async function getChatMessages({
  roomId,
  cursor,
  size = 20,
}: GetChatMessagesParams): Promise<ChatMessageListResponse> {
  const res = await axiosInstance.get<ChatMessageListResponse>(
    `/api/v1/chat/rooms/${roomId}/messages`,
    {
      params: {
        cursor,
        size,
      },
    }
  );
  return res.data;
}