import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import useAttachmentUpload from "./hooks/useAttachmentUpload";
import useChatRoomData from "./hooks/useChatRest";
import useChatLayout from "./hooks/useChatLayout";
import useChatStomp from "./hooks/useChatStomp";
import useChatActions from "./hooks/useChatActions";
import { useCampaignProposalStore } from "../../stores/campaign-proposal";

type Props = {
  roomId: number;
};

export default function ChattingRoom({ roomId }: Props) {
  const navigate = useNavigate();
  const kb = useKeyboardOffset();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [text, setText] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const myUserId = Number(tokenStorage.getUserId() ?? 0);
  const token = tokenStorage.getAccessToken();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useHideBottomTab(true);
  useHideHeader(true);

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

  const { messages, setMessages, detail } = useChatRoomData({ token, roomId });

  const { listRef, sheetHeight } = useChatLayout({
    kb,
    isSheetOpen,
    messagesLength: messages.length,
  });

  const { stompClient, sentMessageIds } = useChatStomp({
    token,
    roomId,
    setMessages,
  });

  const { handleSend, handlePickImage, handlePickFile } = useChatActions({
    roomId,
    myUserId,
    stompClient,
    sentMessageIds,
    upload,
    setMessages,
    text,
    setText,
    setIsSheetOpen,
    inputRef,
  });

  const partnerName = detail?.opponentName ?? "";
  const partnerAvatarUrl = detail?.opponentProfileImageUrl ?? "";
  const isCollaborating = detail?.isCollaborating ?? false;

  const collabTitle = detail?.campaignSummary?.campaignTitle ?? "";
  const collabSubtitle = detail?.campaignSummary?.brandName ?? "";
  const collabThumb = detail?.campaignSummary?.campaignImageUrl ?? partnerAvatarUrl;
  const summaryBarHeight = isCollaborating ? 64 : 0;

  const hasProposal = !!detail?.campaignSummary;
  const setProposalData = useCampaignProposalStore((s) => s.setProposalData);

  const handleSuggest = () => {
    if (!detail) return;
    setProposalData({
      brandId: detail.opponentUserId,
      campaignId: detail.campaignSummary?.campaignId ?? 0,
      domain: "beauty",
      brandName: detail.opponentName,
      campaignTitle: detail.campaignSummary?.campaignTitle,
    });
    navigate("/matching/suggest");
  };

  const actions: AttachmentAction[] = useMemo(
    () => [
      {
        key: "suggest",
        label: hasProposal ? "재 제안" : "제안하기",
        icon: hasProposal ? "refresh" : "suggest",
      },
      { key: "image", label: "이미지", icon: "image" },
      { key: "file", label: "첨부파일", icon: "file" },
    ],
    [hasProposal],
  );

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
        accept="image/png,image/jpeg"
        style={{ display: "none" }}
        onChange={handlePickImage}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
        className="overflow-y-auto px-4 py-5 transition-all duration-300"
        style={{
          height: `calc(100vh - 60px - 49px - ${summaryBarHeight}px - ${
            isSheetOpen ? sheetHeight : 0
          }px - ${kb}px)`,
        }}
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
          if (key === "suggest") handleSuggest();
          if (key === "image") imageInputRef.current?.click();
          if (key === "file") fileInputRef.current?.click();
          setIsSheetOpen(false);
        }}
        height={sheetHeight}
      />
    </div>
  );
}