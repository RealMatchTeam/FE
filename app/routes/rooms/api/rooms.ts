import { axiosInstance } from "../../../api/axios";

//채팅룸 생성 및 조회
type CreateOrGetDirectRoomResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    roomId: number;
    roomKey: string;
    createdAt: string;
  };
};

export async function createOrGetDirectRoom(body: {
  brandId: number;
  creatorId: number;
}): Promise<CreateOrGetDirectRoomResponse["result"]> {
  const res = await axiosInstance.post<CreateOrGetDirectRoomResponse>(
    "/api/v1/chat/rooms",
    body
  );

  const data = res.data;
  if (!data?.isSuccess) {
    throw new Error(data?.message ?? "채팅방 생성/조회 실패");
  }

  return data.result;
}


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

/*export interface SystemMessage {
  schemaVersion: number;
  kind: "PROPOSAL_CARD" | "RE_PROPOSAL_CARD" | "PROPOSAL_STATUS_NOTICE" | "MATCHED_CAMPAIGN_CARD" | "APPLY_CARD" | "APPLY_STATUS_NOTICE";
  payload: unknown; // kind에 따라 다른 구조
}*/

export type ProposalStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
export type ProposalDirection = "NONE" | "BRAND_TO_CREATOR" | "CREATOR_TO_BRAND";
export type NoticeStatus = "CANCELED" | "MATCHED" | "REVIEWING" | "REJECTED" | "NONE" ;

export type ProposalCardPayload = {
  proposalId: number;
  campaignId: number;
  campaignName: string;
  campaignSummary: string;
  proposalStatus: ProposalStatus;
  proposalDirection: ProposalDirection;
};

export type ApplyCardPayload = {
  applyId: number;
  campaignId: number;
  campaignName: string;
  campaignDescription: string;
  applyReason: string;
};

export type MatchedCampaignCardPayload = {
  campaignId: number;
  campaignName: string;
  amount: number;
  currency: string; // 예: "KRW"
  orderNumber: string;
  message: string | null;
};

export type ProposalStatusNoticePayload = {
  proposalId: number;
  actorUserId: number;
  processedAt: string; // ISO string
  proposalStatus: NoticeStatus; 
};

export type ApplyStatusNoticePayload = {
  applyId: number;
  actorUserId: number;
  processedAt: string; // ISO string
  applyStatus: NoticeStatus;
};

export type SystemMessage =
  | {
      schemaVersion: number;
      kind: "PROPOSAL_CARD";
      payload: ProposalCardPayload;
    }
  | {
      schemaVersion: number;
      kind: "RE_PROPOSAL_CARD";
      payload: ProposalCardPayload; 
    }
  | {
      schemaVersion: number;
      kind: "APPLY_CARD";
      payload: ApplyCardPayload;
    }
  | {
      schemaVersion: number;
      kind: "MATCHED_CAMPAIGN_CARD";
      payload: MatchedCampaignCardPayload;
    }
  | {
      schemaVersion: number;
      kind: "PROPOSAL_STATUS_NOTICE";
      payload: ProposalStatusNoticePayload;
    }
  | {
      schemaVersion: number;
      kind: "APPLY_STATUS_NOTICE";
      payload: ApplyStatusNoticePayload;
    };


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
