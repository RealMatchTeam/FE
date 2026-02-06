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

import {
  createOrGetDirectRoom,
  getChatRoomDetail,
  type ChatRoomDetailResponse,
  getChatMessages,
  type ChatMessage,
} from "./api/rooms";

import { useAuthStore } from "../../stores/auth-store";

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

  useHideBottomTab(true);
  useHideHeader(true);

  const accessToken = tokenStorage.getAccessToken?.();
  const myUserId = useAuthStore((s) => Number(s.me?.id ?? 0));

  const partnerName = detail?.opponentName ?? "";
  const partnerAvatarUrl = detail?.opponentProfileImageUrl ?? "";
  const isCollaborating = detail?.isCollaborating ?? false;

  const collabTitle = detail?.campaignSummary?.campaignTitle ?? "";
  const collabSubtitle = detail?.campaignSummary?.brandName ?? "";
  const collabThumb = detail?.campaignSummary?.campaignImageUrl ?? partnerAvatarUrl;
  const summaryBarHeight = isCollaborating ? 64 : 0;

  const createdAt = useMemo(() => {
    const now = new Date().toISOString();
    const { dateText, timeText } = formatKoreanDateTime(now);
    return `${dateText}\n${timeText}`;
  }, []);

  useEffect(() => {
    if (!accessToken) {
      window.location.href = "/auth/login";
    }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
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
  }, [accessToken, brandId, myUserId]);

  useEffect(() => {
    if (!accessToken) return;
    if (!roomId) return;

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
  }, [accessToken, roomId]);

  useEffect(() => {
    if (!accessToken) return;
    if (!roomId) return;

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
  }, [accessToken, roomId]);

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
    if (!trimmed) return;
    if (!roomId) return;

    const tempId = -Date.now();
    const clientId = crypto.randomUUID();

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
      clientMessageId: clientId,
    };

    setMessages((prev) => [...prev, generalText]);
    setText("");
    setIsSheetOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  if (!accessToken) {
    return (
      <div className="h-screen-full bg-white">
        <NavigationHeader title="채팅" onBack={() => history.back()} />
        <div className="p-6 text-text-gray3">로그인이 필요합니다.</div>
      </div>
    );
  }

  if (accessToken && (!myUserId || myUserId <= 0)) {
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
      <NavigationHeader title={partnerName} onBack={() => history.back()} />

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

              return (
                <MessageRenderer
                  key={m.messageId ?? m.clientMessageId ?? `${m.roomId}-${m.createdAt}`}
                  message={m}
                  timeText={createdAt}
                  avatarSrc={isMe ? undefined : partnerAvatarUrl}
                  isCollaborating={isCollaborating}
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
          console.log("action:", key);
          setIsSheetOpen(false);
        }}
        height={sheetHeight}
      />
    </div>
  );
}
