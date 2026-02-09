import { type ChatMessage } from "./rooms";

export interface ChatSendMessageCommand {
  roomId: number;
  messageType: "TEXT" | "IMAGE" | "FILE";
  content: string | null; // TEXT일 때만 필수
  attachmentId: number | null; // IMAGE/FILE일 때만 필수
  clientMessageId: string; // UUID (중복 전송 방지용)
}

export interface ChatMessageCreatedEvent {
  roomId: number;
  message: ChatMessage; // REST API의 ChatMessage와 동일한 구조
}

export interface ChatSendMessageAck {
  clientMessageId: string;
  messageId: number | null; // 성공 시 서버에서 할당한 메시지 ID
  status: "SUCCESS" | "FAILED";
  errorCode: string | null;   // FAILED일 때 에러 코드
  errorMessage: string | null; // FAILED일 때 에러 메시지
}

export interface ChatRoomListUpdatedEvent {
  roomId: number;
}