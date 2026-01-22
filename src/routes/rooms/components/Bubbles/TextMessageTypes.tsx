export type ChatMessage = {
  id: string;
  side: "me" | "other" | "system";
  type: "TEXT" | "SYSTEM_MATCHED" | "SYSTEM_ACCEPTED" | "SYSTEM_REJECTED" | "PROPOSAL" | "RE_PROPOSAL" | "MATCHED_CAMPAIGN" | "IMAGE" | "FILE";
  campaignName?: string;
  campaignContent?: string;
  content?: string; // 텍스트 메시지 내용
  avatarSrc?: string; // 제안하기 test
  avatarSize?: number; // 제안하기 test
  time?: string;
  status?: "sending" | "sent" | "failed";
  price?: number; // 매칭완료
  orderId?: string; // 매칭완료
  fileName?: string; // 첨부파일 이름
  ext?: string; // 첨부파일 확장자
};

export type TextMessageProps = {
  message: ChatMessage;
  /** 상대 프로필(로고) 이미지. 없으면 플레이스홀더 */
  avatarSrc?: string;
  /** 상대 프로필 원형 크기(px) */
  avatarSize?: number;
};