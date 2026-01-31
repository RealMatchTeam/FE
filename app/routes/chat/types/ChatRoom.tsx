export type ChatRoom = {
  id: string;
  brandName: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
  status: RoomStatus;
  logoUrl: string;
  type: "sent" | "received";
  isCollaborating: boolean;
};

export type RoomStatus = "matching" | "reviewing" | "rejected";