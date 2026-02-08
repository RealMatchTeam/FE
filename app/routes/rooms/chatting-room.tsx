import { useEffect, useMemo, useRef, useState } from "react";
import { tokenStorage } from "../../lib/token";
import NavigationHeader from "../../components/common/NavigateHeader";
import ChatComposer from "./components/ChatComposer";
import AttachmentSheet, { type AttachmentAction } from "./components/AttachmentSheet";
import useKeyboardOffset from "../../hooks/KeyboardOffset";
import MessageRenderer from "./components/MessageRender";
import { formatKoreanDateTime } from "../../utils/dateTime";
import CollaborationSummaryBar from "./components/CollaborationBar";
import { useHideBottomTab } from "../../hooks/useHideBottomTab";
import { useHideHeader } from "../../hooks/useHideHeader";
import { getChatRoomDetail, type ChatRoomDetailResponse, getChatMessages, type ChatMessage, createOrGetDirectRoom } from "./api/rooms";
import useAttachmentUpload from "../rooms/hooks/useAttachmentUpload";
import { Client } from "@stomp/stompjs";

type Props = {
  brandId: number;
};

export default function ChattingRoom({ brandId }: Props) {
  const kb = useKeyboardOffset();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [text, setText] = useState("");
  const sheetHeight = kb > 0 ? kb : 240;

  const [roomId, setRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [detail, setDetail] = useState<ChatRoomDetailResponse | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const myUserId = Number(tokenStorage.getUserId() ?? 0); // ID도 여기서 꺼낼 수 있습니다!
  const token = tokenStorage.getAccessToken();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  
  useHideBottomTab(true);
  useHideHeader(true);
  
  const partnerName = detail?.opponentName ?? "";
  const partnerAvatarUrl = detail?.opponentProfileImageUrl ?? "";
  const isCollaborating = detail?.isCollaborating ?? false;

  const collabTitle = detail?.campaignSummary?.campaignTitle ?? "";
  const collabSubtitle = detail?.campaignSummary?.brandName ?? "";
  const collabThumb = detail?.campaignSummary?.campaignImageUrl ?? partnerAvatarUrl;
  const summaryBarHeight = isCollaborating ? 64 : 0;

  const stompClient = useRef<Client | null>(null);
  const sentMessageIds = useRef<Set<string>>(new Set()); // 내가 보낸 메시지 추적용

  useEffect(() => {
    if (!token) {
      window.location.href = "/auth/login";
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    if (!Number.isFinite(brandId) || brandId <= 0) return;
    if (!Number.isFinite(myUserId) || myUserId <= 0) return;

    const run = async () => {
      try {
        const result = await createOrGetDirectRoom({ brandId, creatorId: myUserId });
        setRoomId(result.roomId);
      } catch (e) {
        console.error("createOrGetDirectRoom failed:", e);
        setRoomId(null);
      }
    };

    run();
  }, [token, brandId, myUserId]);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { upload } = useAttachmentUpload({
    baseUrl,
    token,
    defaultUsage: "CHAT",
  });

  const handleAttachmentAction = (key: "suggest" | "image" | "file") => {
    if (key === "image") {
      imageInputRef.current?.click();
      return;
    }
    if (key === "file") {
      fileInputRef.current?.click();
      return;
    }
  };

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
        setMessages(data.messages.slice().reverse());
      } catch (e) {
        console.error(e);
        setMessages([]);
      }
    };

    run();
  }, [token, roomId]);

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

    const client = new Client({
      brokerURL: import.meta.env.VITE_WS_URL, // 로컬: ws://host/api/v1/ws/chat
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log("Connected to STOMP");

      // 1. 메시지 수신 구독
      client.subscribe(`/topic/v1/rooms/${roomId}`, (message) => {
        const payload = JSON.parse(message.body);
        const newMessage: ChatMessage = payload.message;

        // clientMessageId가 있고, 내가 보낸 목록에 있다면 무시
        if (newMessage.clientMessageId && sentMessageIds.current.has(newMessage.clientMessageId)) {
          // 보낸 메시지가 서버를 통해 돌아온 것이 확인되면 Set에서 제거 (관리 최적화)
          sentMessageIds.current.delete(newMessage.clientMessageId);
          return;
        }

        setMessages((prev) => [...prev, newMessage]);
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
    []
  );

  const handleToggleSheet = () => {
    setIsSheetOpen((prev) => {
      const next = !prev;
      if (next) inputRef.current?.blur();
      return next;
    });
  };

  const handleCloseSheet = () => setIsSheetOpen(false);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !roomId || !stompClient.current?.connected) return;

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
  };

  // 1. 이미지 선택 핸들러
  const handlePickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!roomId) return;
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

  // 2. 파일 선택 핸들러
  const handlePickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!roomId) return;
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

  if (token && (!myUserId || myUserId <= 0)) {
    return (
      <div className="h-screen-full bg-white">
        <NavigationHeader title="채팅" onBack={() => history.back()} />
        <div className="p-6 text-text-gray3">로그인 정보 불러오는 중...</div>
      </div>
    );
  }

  if (!roomId) {
    return (
      <div className="h-screen-full bg-white">
        <NavigationHeader title="채팅" onBack={() => history.back()} />
        <div className="p-6 text-text-gray3">채팅방을 여는 중...</div>
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

      <NavigationHeader
        title={partnerName}
        onBack={() => history.back()}
      />

      {detail?.campaignSummary && (
        <CollaborationSummaryBar thumbnailUrl={collabThumb} title={collabTitle} subtitle={collabSubtitle} />
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
        onToggleSheet={handleToggleSheet}
        isSheetOpen={isSheetOpen}
        sheetHeight={sheetHeight}
      />

      <AttachmentSheet
        open={isSheetOpen}
        actions={actions}
        onClose={handleCloseSheet}
        onAction={(key) => {
          handleAttachmentAction(key);
          console.log("action:", key);
          setIsSheetOpen(false);
        }}
        height={sheetHeight}
      />
    </div>
  );
}