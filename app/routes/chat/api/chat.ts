import { axiosInstance } from "../../../api/axios";

//채팅 리스트 조회

export type ChatRoomListStatus = "LATEST" | "COLLABORATING";

export interface ChatRoomListResponse {
  totalUnreadCount: number;
  rooms: ChatRoomCard[];
  nextCursor: string | null;
  hasNext: boolean;
}

export interface ChatRoomCard {
  roomId: number;
  opponentUserId: number;
  opponentName: string;
  opponentProfileImageUrl: string | null;
  isCollaborating: boolean;
  lastMessagePreview: string;
  lastMessageType: "TEXT" | "IMAGE" | "FILE" | "SYSTEM";
  lastMessageAt: string; // ISO-8601
  unreadCount: number;
}

type GetChatRoomsParams = {
  status?: ChatRoomListStatus; // 기본값 LATEST
  cursor?: string;            
  size?: number;           
  search?: string;
};

export async function getChatRooms(params: GetChatRoomsParams): Promise<ChatRoomListResponse> {
  const { status, cursor, size = 20, search } = params;

  const res = await axiosInstance.get<ChatRoomListResponse>("/api/v1/chat/rooms", {
    params: {
      status,
      cursor,
      size,
      search: search && search.trim().length > 0 ? search.trim() : undefined,
    },
  });

  return res.data;
}


