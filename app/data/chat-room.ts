import { type ChatRoom } from "../routes/chat/types/ChatRoom";

export const rooms: ChatRoom[] = [
  {
    id: "1",
    brandName: "비플레인",
    lastMessage: "안녕하세요! 제안 확인 부탁드립니다.안녕하세요 제안 확인 부탁드립니다 안녕하세요 제안 확인 부탁드립니다 안녕하세요 제안 확인 부탁드립니다",
    updatedAt: new Date().toISOString(),
    unreadCount: 2,
    status: "matching",
    logoUrl: "",
    type: "sent",
  },
  {
    id: "2",
    brandName: "라운드랩",
    lastMessage: "검토 중입니다!",
    updatedAt: "2025-01-05T10:00:00",
    unreadCount: 0,
    status: "reviewing",
    logoUrl: "",
    type: "received",
  },
];

// TODO: API 연결 전 임시 더미 데이터