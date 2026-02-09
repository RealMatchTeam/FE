import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "sonner";
import type { ChatMessage } from "../api/rooms";

type Args = {
  token: string | null;
  roomId: number;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
};

export default function useChatStomp({ token, roomId, setMessages }: Args) {
  const stompClient = useRef<Client | null>(null);
  const sentMessageIds = useRef<Set<string>>(new Set()); // 내가 보낸 메시지 추적용

  useEffect(() => {
    // 방이 바뀔 때 이전 방 데이터 정리
    sentMessageIds.current.clear();
  }, [roomId]);

  useEffect(() => {
    if (!token || !roomId) return;

    // 이미 활성화된 클라이언트가 있다면 비활성화 후 새로 생성
    if (stompClient.current) {
      stompClient.current.deactivate();
    }

    const httpBase = import.meta.env.VITE_API_BASE_URL;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${httpBase}/api/v1/ws/chat`),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str: string) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log("Connected to STOMP");

      // 1. 메시지 수신 구독
      client.subscribe(`/topic/v1/rooms/${roomId}`, (message) => {
        const payload = JSON.parse(message.body);
        // 서버 응답 구조에 따라 message 또는 payload 직접 사용
        const newMessage: ChatMessage = payload.message ?? payload;

        // clientMessageId가 있고, 내가 보낸 목록에 있다면 무시 (내가 보낸 메시지 에코)
        const clientId = newMessage.clientMessageId;
        if (clientId && sentMessageIds.current.has(clientId)) {
          sentMessageIds.current.delete(clientId);
          return;
        }

        // 중복 메시지 방지: 이미 같은 clientMessageId 또는 messageId가 있으면 무시
        setMessages((prev) => {
          const isDuplicate = prev.some(
            (m) =>
              (clientId && m.clientMessageId === clientId) ||
              (newMessage.messageId > 0 && m.messageId === newMessage.messageId),
          );
          if (isDuplicate) return prev;
          return [...prev, newMessage];
        });
      });

      // 2. 전송 ACK 구독
      client.subscribe(`/user/queue/v1/chat.ack`, (message) => {
        const ack = JSON.parse(message.body);
        if (ack.status === "FAILED") {
          console.error("Message send failed:", ack.errorMessage);
          toast.error(ack.errorMessage || "메시지 전송에 실패했습니다.");

          // 실패한 메시지를 UI에서 제거
          if (ack.clientMessageId) {
            setMessages((prev) =>
              prev.filter((m) => m.clientMessageId !== ack.clientMessageId),
            );
          }
        }
      });
    };

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
    };
  }, [token, roomId, setMessages]);

  return { stompClient, sentMessageIds };
}