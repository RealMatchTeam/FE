import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../../../stores/auth-store";
import { getChatMessages, getChatRoomDetail, type ChatMessage, type ChatRoomDetailResponse, } from "../api/rooms";

type UseChatRoomArgs = {
  roomId: number;
  pageSize?: number;
};

export function useChatRoom({ roomId, pageSize = 20 }: UseChatRoomArgs) {
  const [detail, setDetail] = useState<ChatRoomDetailResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const myUserId = useAuthStore((s) => Number(s.me?.id ?? 0));

  useEffect(() => {
    if (!Number.isFinite(roomId)) return;

    const run = async () => {
      setIsLoadingDetail(true);
      try {
        const data = await getChatRoomDetail(roomId);
        setDetail(data);
      } catch (e) {
        console.error("getChatRoomDetail failed:", e);
        setDetail(null);
      } finally {
        setIsLoadingDetail(false);
      }
    };

    run();
  }, [roomId]);

  useEffect(() => {
    if (!Number.isFinite(roomId)) return;

    const run = async () => {
      setIsLoadingMessages(true);
      try {
        const data = await getChatMessages({ roomId, size: pageSize });
        // 오래된 -> 최신 순
        setMessages(data.messages.slice().reverse());
      } catch (e) {
        console.error("getChatMessages failed:", e);
        setMessages([]);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    run();
  }, [roomId, pageSize]);

  const derived = useMemo(() => {
    const partnerName = detail?.opponentName ?? "";
    const partnerAvatarUrl = detail?.opponentProfileImageUrl ?? "";
    const isCollaborating = detail?.isCollaborating ?? false;

    const collabTitle = detail?.campaignSummary?.campaignTitle ?? "";
    const collabSubtitle = detail?.campaignSummary?.brandName ?? "";
    const collabThumb =
      detail?.campaignSummary?.campaignImageUrl ?? partnerAvatarUrl;

    const summaryBarHeight = isCollaborating ? 64 : 0;

    return {
      partnerName,
      partnerAvatarUrl,
      isCollaborating,
      collabTitle,
      collabSubtitle,
      collabThumb,
      summaryBarHeight,
    };
  }, [detail]);

  return {
    myUserId,
    detail,
    setDetail,
    messages,
    setMessages,
    isLoadingDetail,
    isLoadingMessages,
    ...derived,
  };
}