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
import useAttachmentUpload from "../rooms/hooks/useAttachmentUpload";
import { tokenStorage } from "../../lib/token";

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

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const myUserId = Number(tokenStorage.getUserId() ?? 0); // ID도 여기서 꺼낼 수 있습니다!
  const token = tokenStorage.getAccessToken();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

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

  // 1. 이미지 선택 핸들러
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
        messageType: "IMAGE", // 또는 "FILE" (백엔드 스펙에 맞게)
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
      // 에러 토스트 처리 등을 여기에 추가
    }
  };

  // 2. 파일 선택 핸들러
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
          handleAttachmentAction(key);
          console.log("action:", key);
          setIsSheetOpen(false);
        }}
        height={sheetHeight}
      />
    </div>
  );
}