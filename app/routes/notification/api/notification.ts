import { axiosInstance } from "../../../api/axios";

export interface NotificationItem {
  id: string;
  kind: string;
  category: "PROPOSAL" | "MATCHING" | string;
  title: string;
  body: string;
  campaignId: number;
  proposalId: number;
  isRead: boolean;
  createdAt: string;
  iconType: string;
}

export interface NotificationResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    items: NotificationItem[];
    groups: {
      date: string;
      label: string;
      count: number;
    }[];
    unreadCount: number;
    totalElements: number;
    totalPages: number;
  };
}

export const fetchNotifications = async (
  filter: "ALL" | "PROPOSAL" | "MATCHING" = "ALL",
  page: number = 0,
  size: number = 20
): Promise<NotificationResponse> => {
  const response = await axiosInstance.get("/v1/notifications", {
    params: { filter, page, size },
  });
  return response.data;
};

export const readAllNotifications = async (): Promise<{ isSuccess: boolean; result: { updatedCount: number } }> => {
  const response = await axiosInstance.patch("/v1/notifications/read-all");
  return response.data;
};