import { useEffect, useMemo, useRef, useState } from "react";
import ChatRoomHeader from "./components/ChatRoomHeader";
import { type ChatMessage } from "./components/Bubbles/TextMessageTypes";
import ChatComposer from "./components/ChatComposer";
import AttachmentSheet, { type AttachmentAction } from "./components/AttachmentSheet";
import useKeyboardOffset from "../../hooks/KeyboardOffset";
import MessageRenderer from "./components/MessageRender";
import { formatKoreanDateTime } from "../../utils/dateTime";

type Props = {
  chatId: string;
};

export default function ChattingRoom( {chatId} : Props ) {

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "p1",
      side: "other", // me -> 인플루언서 other -> 브랜드 test
      type: "PROPOSAL",
      campaignName: "글로우 쿠션 신제품 론칭 리뷰",
      campaignContent: "안녕하세요 크리에이터 비비 입니다! 이번에 글로우에서 신제품 쿠션이 출시되어 리뷰를 진행하고자 합니다. 자연스러운 커버력과 촉촉한 사용감이 특징인 이번 제품은 봄철 메이크업에 딱 맞는 아이템입니다. 리뷰를 통해 많은 분들께 소개하고 싶습니다. 긍정적인 검토 부탁드립니다!",
      time: "26.01.22\n00:10",
      status: "sent",
      avatarSize: 38,
    },
    {
      id: "p1",
      side: "me", // me -> 인플루언서 other -> 브랜드 test
      type: "PROPOSAL",
      campaignName: "글로우 쿠션 신제품 론칭 리뷰",
      campaignContent: "안녕하세요 크리에이터 비비 입니다! 이번에 글로우에서 신제품 쿠션이 출시되어 리뷰를 진행하고자 합니다. 자연스러운 커버력과 촉촉한 사용감이 특징인 이번 제품은 봄철 메이크업에 딱 맞는 아이템입니다. 리뷰를 통해 많은 분들께 소개하고 싶습니다. 긍정적인 검토 부탁드립니다!",
      time: "26.01.22\n00:10",
      status: "sent",
    },
    {
      id: "p1",
      side: "other", 
      type: "MATCHED_CAMPAIGN",
      campaignName: "글로우 쿠션 신제품 론칭 리뷰",
      campaignContent: "안녕하세요 크리에이터 비비 입니다! 이번에 글로우에서 신제품 쿠션이 출시되어 리뷰를 진행하고자 합니다. 자연스러운 커버력과 촉촉한 사용감이 특징인 이번 제품은 봄철 메이크업에 딱 맞는 아이템입니다. 리뷰를 통해 많은 분들께 소개하고 싶습니다. 긍정적인 검토 부탁드립니다!",
      time: "26.01.22\n00:10",
      status: "sent",
      price: 500000,
      orderId: "ORD1234567890",
    },
    {
      id: "m1",
      side: "other",
      type: "TEXT",
      content: "안녕하세요 캠페인 문의 드립니다.\n협업 가능하신지 확인 부탁드립니다.",
      time: "26.01.21\n09:40",
      avatarSize: 38,
    },
    {
      id: "m4",
      side: "system",
      type: "SYSTEM_MATCHED",
    },
    {
      id: "img1",
      side: "other",
      type: "IMAGE",
      fileName: "IM_1234",
      ext: "png",
      time: "26.01.22\n10:11",
      avatarSize: 38,
      avartarSrc: "/brand.png",
    },
    {
      id: "file1",
      side: "me",
      type: "FILE",
      fileName: "계약서_v2",
      ext: "pdf",
      time: "26.01.22\n10:12",
    }
  ]);

  const kb = useKeyboardOffset();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [text, setText] = useState("");
  const sheetHeight = kb > 0 ? kb : 240;
  const { dateText, timeText } = formatKoreanDateTime(new Date().toISOString());

  useEffect(() => {
    // TODO: chatId로 메시지 불러오기
    console.log("fetch messages for chatId:", chatId);
  }, [chatId]);

  const partnerName = "민주"; // TODO: API/route loader에서 받아오기
  const hashtags = "#청정자극 #저자극 #심플한 감성"; // TODO: 프로필/카드에서 받아오기
  const matchStatus: "MATCHED" | "REJECTED" | "REVIEWING" = "REVIEWING"; // TODO: 서버에서 받아오기
  const partnerAvatarUrl = ""
; // TODO: 프로필/카드에서 받아오기

  // 대화 시작 여부
  const hasStartedChat = messages.some((m) => m.side === "me" || m.side === "other");
  // 전송 중 상태
  //const [isSending, setIsSending] = useState(false);

  const statusLabelMap = {
  MATCHED: "매칭",
  REJECTED: "거절",
  REVIEWING: "검토중",
  } as const;

  const subtitleClass = hasStartedChat ? "text-[#6666E5]" : "text-[#5B5D6B]";
  const subtitleText = hasStartedChat ? statusLabelMap[matchStatus] : hashtags;

  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

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

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        side: "me",
        content: trimmed,
        time: `${dateText}\n${timeText}`,
        type: "TEXT",
        status: "sent", // 수정필요
        campaignName: "",
        campaignContent: "",
      },
    ]);
    setText(""); // 입력창 비우기
    setIsSheetOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus()); // 한 프레임 뒤 focus 복귀
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F6FF] via-[#F3F3FA] to-[#E8E8FB]">
      <ChatRoomHeader
        title={partnerName}
        subtitle={subtitleText}
        subTitleClass={subtitleClass}
        onBack={() => history.back()}
      />

      {/* 메시지 영역 */}
      <div
        ref={listRef}
        className="h-[calc(100vh-60px-49px)] overflow-y-auto px-4 py-5"
      >
        <div className="w-full">
          <div className="w-full space-y-2">
            {messages.map((m) => (
              <MessageRenderer
                key={m.id}
                message={m}
                avatarSrc= {m.side === "me" ? undefined : partnerAvatarUrl} // 상대방 메시지에만 아바타 표시
                avatarSize={38}
              />
            ))}
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