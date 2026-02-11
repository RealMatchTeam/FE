import { type ChatRoom } from "../routes/chat/page";

export const rooms: ChatRoom[] = [
  {
    id: "1",
    brandName: "비플레인",
    lastMessage: "안녕하세요! 제안 확인 부탁드립니다.안녕하세요 제안 확인 부탁드립니다 안녕하세요 제안 확인 부탁드립니다 안녕하세요 제안 확인 부탁드립니다",
    updatedAt: new Date().toISOString(),
    unreadCount: 2,
    logoUrl: "",
    type: "sent",
    isCollaborating: true,
  },
  {
    id: "2",
    brandName: "라운드랩",
    lastMessage: "검토 중입니다!",
    updatedAt: "2025-01-05T10:00:00",
    unreadCount: 0,
    logoUrl: "",
    type: "sent",
    isCollaborating: false,
  },
];
