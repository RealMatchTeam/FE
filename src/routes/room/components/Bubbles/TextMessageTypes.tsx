export type ChatMessage = {
  id: string;
  side: "me" | "other" | "system";
  type: "TEXT" | "SYSTEM_EVENT" | "PROPOSAL" | "RE_PROPOSAL" | "MATCHED_CAMPAIGN" | "IMAGE" | "FILE";
  content: string;
  time?: string;
  status?: "sending" | "sent" | "failed";
};

export type TextMessageProps = {
  message: ChatMessage;
  /** 상대 프로필(로고) 이미지. 없으면 플레이스홀더 */
  avatarSrc?: string;
  /** 상대 프로필 원형 크기(px) */
  avatarSize?: number;
};