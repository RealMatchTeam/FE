import { useEffect, useMemo, useRef, useState } from "react";
import NavigationHeader from "../../components/common/NavigateHeader";
import ChatComposer from "./components/ChatComposer";
import AttachmentSheet, { type AttachmentAction } from "./components/AttachmentSheet";
import useKeyboardOffset from "../../hooks/KeyboardOffset";
import MessageRenderer from "./components/MessageRender";
import { formatKoreanDateTime } from "../../utils/dateTime";
import CollaborationSummaryBar from "./components/CollaborationBar";
import { useHideBottomTab } from "../../hooks/useHideBottomTab";
import { useHideHeader } from "../../hooks/useHideHeader";
import { getChatRoomDetail, type ChatRoomDetailResponse, getChatMessages, type ChatMessage } from "./api/rooms";
import { useAuthStore } from "../../stores/auth-store";

type Props = {
  roomId: number;
};

export default function ChattingRoom( {roomId} : Props ) {
  const kb = useKeyboardOffset();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [text, setText] = useState("");
  const sheetHeight = kb > 0 ? kb : 240;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message] = useState<ChatMessage | null>(null);
  const [detail, setDetail] = useState<ChatRoomDetailResponse | null>(null);
  const { dateText, timeText } = useMemo(() => {
    if (!message) {
      return { dateText: "", timeText: "" };
    }
    return formatKoreanDateTime(message.createdAt);
  }, [message]);
  const createdAt =`${dateText}\n${timeText}`;


  const myUserId = useAuthStore((s) => Number(s.me?.id ?? 0));
  const partnerName = detail?.opponentName ?? "";
  const partnerAvatarUrl = detail?.opponentProfileImageUrl ?? "";
  const isCollaborating = detail?.isCollaborating ?? false;

  const collabTitle = detail?.campaignSummary?.campaignTitle ?? "";
  const collabSubtitle = detail?.campaignSummary?.brandName ?? "";
  const collabThumb = detail?.campaignSummary?.campaignImageUrl ?? partnerAvatarUrl; // 콜라보 상품 이미지

  const summaryBarHeight = isCollaborating ? 64 : 0;

  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  //const [cursor, setCursor] = useState<string | null>(null);
  //const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(roomId)) return;

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
  }, [roomId]);

  useEffect(() => {
  if (!Number.isFinite(roomId)) return;

  const run = async () => {
    try {
      const data = await getChatMessages({ roomId, size: 20 });
      setMessages(data.messages.slice().reverse());
      //setCursor(data.nextCursor);
      //setHasNext(data.hasNext);
    } catch (e) {
      console.error(e);
      setMessages([]);
      //setCursor(null);
      //setHasNext(false);
    }
  };

  run();
}, [roomId]);

  useHideBottomTab(true);
  useHideHeader(true);

  const actions: AttachmentAction[] = useMemo(
    () => [
      { key: "suggest", label: "재 제안", icon: "refresh" },
      { key: "image", label: "이미지", icon: "image" },
      { key: "file", label: "첨부파일", icon: "file" },
    ],
    []
  );

  const scrollToBottom = () => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const handleToggleSheet = () => {
    setIsSheetOpen((prev) => {
      const next = !prev;
      if (next) {
        // 시트 열릴 때 키보드 내려감
        inputRef.current?.blur();
      }
      return next;
    });
  };

  const handleCloseSheet = () => setIsSheetOpen(false);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const tempId = -Date.now(); // 임시 messageId (음수)
    const clientId = crypto.randomUUID();

    const generalText: ChatMessage = { 
      messageId: tempId,
      roomId,
      senderId: myUserId, // 내 유저 id
      senderType: "USER",
      messageType: "TEXT",
      content: trimmed,
      attachment: null,
      systemMessage: null,
      createdAt: createdAt,
      clientMessageId: clientId,
    };

    //일반 메시지 전송
    setMessages((prev) => [ ...prev, generalText]);

    setText(""); // 입력창 비우기
    setIsSheetOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus()); // 한 프레임 뒤 focus 복귀
  };

  return (
    <div className="h-screen-full bg-gradient-to-b from-[#F6F6FF] via-[#F3F3FA] to-[#E8E8FB]">
      <NavigationHeader
        title={partnerName}
        onBack={() => history.back()}
      />

      {detail?.campaignSummary && (
        <CollaborationSummaryBar
          thumbnailUrl={collabThumb}
          title={collabTitle}
          subtitle={collabSubtitle}
        />
      )}

      {/* 메시지 영역 */}
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
                  //isMe={isMe}                         
                  timeText={createdAt}              
                  avatarSrc={isMe ? undefined : partnerAvatarUrl}
                  isCollaborating={isCollaborating}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* 입력창 */}
      <ChatComposer
        inputRef={inputRef}
        value={text}
        onChange={setText}
        onSend={handleSend}
        onToggleSheet={handleToggleSheet}
        isSheetOpen={isSheetOpen}
        sheetHeight={sheetHeight}
      />

      {/* 첨부/기능 시트 */}
      <AttachmentSheet
        open={isSheetOpen}
        actions={actions}
        onClose={handleCloseSheet}
        onAction={(key) => {
          // TODO: 여기서 업로드/기능 연결
          console.log("action:", key);
          setIsSheetOpen(false);
        }}
        height={sheetHeight}
      />
    </div>
  );
}