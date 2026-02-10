import { useEffect, useState } from "react";
import {
  getChatRoomDetail,
  getChatMessages,
  type ChatMessage,
  type ChatRoomDetailResponse,
} from "../api/rooms";

type Args = {
  token: string | null;
  roomId: number;
};

export default function useChatRoomData({ token, roomId }: Args) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [detail, setDetail] = useState<ChatRoomDetailResponse | null>(null);

  useEffect(() => {
    if (!token || !roomId) return;

    const run = async () => {
      try {
        const data = await getChatRoomDetail(roomId);
        setDetail(data);
      } catch (e) {
        console.error("getChatRoomDetail failed:", e);
        setDetail(null);
      }
    };

    run();
  }, [token, roomId]);

  useEffect(() => {
    if (!token || !roomId) return;

    const run = async () => {
      try {
        const data = await getChatMessages({ roomId, size: 20 });
        console.log("getChatMessages raw:", data);

        setMessages(data.messages.slice().reverse());
      } catch (e) {
        console.error(e);
        setMessages([]);
      }
    };

    run();
  }, [token, roomId]);

  return { messages, setMessages, detail, setDetail };
}