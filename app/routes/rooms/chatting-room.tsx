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

  const createdAt = useMemo(() => {
    const now = new Date().toISOString();
    const { dateText, timeText } = formatKoreanDateTime(now);
    return `${dateText}\n${timeText}`;
  }, []);

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
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

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
    if (!trimmed) return;

    const tempId = -Date.now();

    const generalText: ChatMessage = {
      messageId: tempId,
      roomId,
      senderId: myUserId,
      senderType: "USER",
      messageType: "TEXT",
      content: trimmed,
      attachment: null,
      systemMessage: null,
      createdAt,
      clientMessageId: crypto.randomUUID(),
    };

    setMessages((prev) => [...prev, generalText]);
    setText("");
    setIsSheetOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handlePickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      const uploaded = await upload({ file, attachmentType: "IMAGE" });

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
        clientMessageId: crypto.randomUUID(),
      };

      setMessages((prev) => [...prev, tempMessage]);
      setIsSheetOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      const uploaded = await upload({ file, attachmentType: "FILE" });

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
        clientMessageId: crypto.randomUUID(),
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
        <div className="space-y-2">
          {messages.map((m) => {
            const isMe = m.senderType === "USER" && m.senderId === myUserId;

            return (
              <MessageRenderer
                key={
                  m.messageId ??
                  m.clientMessageId ??
                  `${m.roomId}-${m.createdAt}`
                }
                message={m}
                timeText={createdAt}
                avatarSrc={isMe ? undefined : partnerAvatarUrl}
              />
            );
          })}
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
