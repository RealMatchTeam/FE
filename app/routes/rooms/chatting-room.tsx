import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tokenStorage } from "../../lib/token";
import NavigationHeader from "../../components/common/NavigateHeader";
import ChatComposer from "./components/ChatComposer";
import AttachmentSheet, {
  type AttachmentAction,
} from "./components/AttachmentSheet";
import useKeyboardOffset from "../../hooks/KeyboardOffset";
import MessageRenderer from "./components/MessageRender";
import { formatKoreanDateTime } from "../../utils/dateTime";
import CollaborationSummaryBar from "./components/CollaborationBar";
import { useHideBottomTab } from "../../hooks/useHideBottomTab";
import { useHideHeader } from "../../hooks/useHideHeader";
import {
  getChatRoomDetail,
  type ChatRoomDetailResponse,
  getChatMessages,
  type ChatMessage,
} from "./api/rooms";
import useAttachmentUpload from "../rooms/hooks/useAttachmentUpload";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type Props = {
  roomId: number;
};

export default function ChattingRoom({ roomId }: Props) {
  const navigate = useNavigate();
  const kb = useKeyboardOffset();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [text, setText] = useState("");
  const sheetHeight = kb > 0 ? kb : 240;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [detail, setDetail] = useState<ChatRoomDetailResponse | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const myUserId = Number(tokenStorage.getUserId() ?? 0); 
  const token = tokenStorage.getAccessToken();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useHideBottomTab(true);
  useHideHeader(true);

  const partnerName = detail?.opponentName ?? "";
  const partnerAvatarUrl = detail?.opponentProfileImageUrl ?? "";
  const isCollaborating = detail?.isCollaborating ?? false;

  const collabTitle = detail?.campaignSummary?.campaignTitle ?? "";
  const collabSubtitle = detail?.campaignSummary?.brandName ?? "";
  const collabThumb =
    detail?.campaignSummary?.campaignImageUrl ?? partnerAvatarUrl;
  const summaryBarHeight = isCollaborating ? 64 : 0;

  const stompClient = useRef<Client | null>(null);
  const sentMessageIds = useRef<Set<string>>(new Set()); // 내가 보낸 메시지 추적용
  const isSending = useRef(false); // 중복 전송 방지

  useEffect(() => {
    if (!token) {
      navigate("/auth/login", { replace: true });
    }
  }, [token, navigate]);

  const { upload } = useAttachmentUpload({
    baseUrl,
    token,
    defaultUsage: "CHAT",
  });

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
///////////
  useEffect(() => {
  console.log("[roomId changed]", roomId);
}, [roomId]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    // 수정
    requestAnimationFrame(() => {
    el.scrollTop = el.scrollHeight;
  });
  }, [messages.length]);

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
          const isDuplicate = prev.some((m) =>
            (clientId && m.clientMessageId === clientId) ||
            (newMessage.messageId > 0 && m.messageId === newMessage.messageId)
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
          // 실패 시 UI 로직 
        }
      });
    };

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
    };
  }, [token, roomId]);

  const actions: AttachmentAction[] = useMemo(
    () => [
      { key: "suggest", label: "재 제안", icon: "refresh" },
      { key: "image", label: "이미지", icon: "image" },
      { key: "file", label: "첨부파일", icon: "file" },
    ],
    [],
  );

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !roomId || !stompClient.current?.connected) return;

    // 중복 전송 방지
    if (isSending.current) return;
    isSending.current = true;

    const clientId = crypto.randomUUID();
    sentMessageIds.current.add(clientId); // 보낸 ID 저장

    const payload = {
      roomId,
      messageType: "TEXT",
      content: trimmed,
      attachmentId: null,
      clientMessageId: clientId,
    };

    // 서버로 전송
    stompClient.current.publish({
      destination: "/app/v1/chat.send",
      body: JSON.stringify(payload),
    });

    const tempMessage: ChatMessage = {
      messageId: -Date.now(),
      roomId,
      senderId: myUserId,
      senderType: "USER",
      messageType: "TEXT",
      content: trimmed,
      attachment: null,
      systemMessage: null,
      createdAt: new Date().toISOString(),
      clientMessageId: clientId,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setText("");
    setIsSheetOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());

    // 짧은 딜레이 후 다시 전송 가능
    setTimeout(() => {
      isSending.current = false;
    }, 300);
  };

  const handlePickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      const uploaded = await upload({ file, attachmentType: "IMAGE" });

      const clientId = crypto.randomUUID();
      sentMessageIds.current.add(clientId);

      const payload = {
        roomId,
        messageType: "IMAGE", 
        content: null,
        attachmentId: uploaded.attachmentId, // 업로드된 ID 사용
        clientMessageId: clientId,
      };

      // STOMP 서버로 전송
      stompClient.current?.publish({
        destination: "/app/v1/chat.send",
        body: JSON.stringify(payload),
      });

      const tempMessage: ChatMessage = {
        messageId: -Date.now(),
        roomId,
        senderId: myUserId,
        senderType: "USER",
        messageType: "IMAGE", 
        content: null,
        attachment: {
          attachmentId: uploaded.attachmentId,
          attachmentType: "IMAGE",
          contentType: uploaded.contentType,
          originalName: uploaded.originalName,
          fileSize: uploaded.fileSize,
          accessUrl: uploaded.accessUrl,
          status: "READY",
        },
        systemMessage: null,
        createdAt: new Date().toISOString(),
        clientMessageId: clientId,
      };

      setMessages((prev) => [...prev, tempMessage]);
      setIsSheetOpen(false);
    } catch (err) {
      console.error(err);
      // 에러 토스트 처리 
    }
  };

  const handlePickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      const uploaded = await upload({ file, attachmentType: "FILE" });

      const clientId = crypto.randomUUID();
      sentMessageIds.current.add(clientId);

      const payload = {
        roomId,
        messageType: "FILE", 
        content: null,
        attachmentId: uploaded.attachmentId, // 업로드된 ID 사용
        clientMessageId: clientId,
      };

      // STOMP 서버로 전송 
      stompClient.current?.publish({
        destination: "/app/v1/chat.send",
        body: JSON.stringify(payload),
      });

      const tempMessage: ChatMessage = {
        messageId: -Date.now(),
        roomId,
        senderId: myUserId,
        senderType: "USER",
        messageType: "FILE",
        content: null,
        attachment: {
          attachmentId: uploaded.attachmentId,
          attachmentType: "FILE",
          contentType: uploaded.contentType,
          originalName: uploaded.originalName,
          fileSize: uploaded.fileSize,
          accessUrl: uploaded.accessUrl,
          status: "READY",
        },
        systemMessage: null,
        createdAt: new Date().toISOString(),
        clientMessageId: clientId,
      };

      setMessages((prev) => [...prev, tempMessage]);
      setIsSheetOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) {
    return (
      <div className="h-screen-full bg-white">
        <NavigationHeader title="채팅" onBack={() => history.back()} />
        <div className="p-6 text-text-gray3">로그인이 필요합니다.</div>
      </div>
    );
  }

  if (!myUserId || myUserId <= 0) {
    return (
      <div className="h-screen-full bg-white">
        <NavigationHeader title="채팅" onBack={() => history.back()} />
        <div className="p-6 text-text-gray3">로그인 정보 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="h-screen-full bg-gradient-to-b from-[#F6F6FF] via-[#F3F3FA] to-[#E8E8FB]">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handlePickImage}
      />
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handlePickFile}
      />

      <NavigationHeader title={partnerName} onBack={() => history.back()} />

      {detail?.campaignSummary && (
        <CollaborationSummaryBar
          thumbnailUrl={collabThumb}
          title={collabTitle}
          subtitle={collabSubtitle}
        />
      )}

      <div
        ref={listRef}
        className="overflow-y-auto px-4 py-5"
        style={{ height: `calc(100vh - 60px - 49px - ${summaryBarHeight}px)` }}
      >
        <div className="w-full">
          <div className="w-full space-y-2">
            {messages.map((m) => {
              const isMe = m.senderType === "USER" && m.senderId === myUserId;
              const { dateText, timeText } = formatKoreanDateTime(m.createdAt);
              const messageKey = m.clientMessageId || m.messageId || `${m.roomId}-${m.createdAt}`;

              return (
                <MessageRenderer
                  key={messageKey}
                  message={m}
                  timeText={`${dateText}\n${timeText}`}
                  avatarSrc={isMe ? undefined : partnerAvatarUrl}
                />
              );
            })}
          </div>
        </div>
      </div>

      <ChatComposer
        inputRef={inputRef}
        value={text}
        onChange={setText}
        onSend={handleSend}
        onToggleSheet={() => setIsSheetOpen((p) => !p)}
        isSheetOpen={isSheetOpen}
        sheetHeight={sheetHeight}
      />

      <AttachmentSheet
        open={isSheetOpen}
        actions={actions}
        onClose={() => setIsSheetOpen(false)}
        onAction={(key) => {
          if (key === "image") imageInputRef.current?.click();
          if (key === "file") fileInputRef.current?.click();
          setIsSheetOpen(false);
        }}
        height={sheetHeight}
      />
    </div>
  );
}
