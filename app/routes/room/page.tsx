import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tokenStorage } from "../../lib/token";
import NavigationHeader from "../../components/common/NavigateHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
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
import CampaignProposalBottomSheet from "../chat/components/CampaignProposalBottomSheet";
import { getMyCollaborations } from "../business/calendar/api/calendar";

type Props = {
  roomId: number;
};

export default function ChattingRoom({ roomId }: Props) {
  const navigate = useNavigate();
  const kb = useKeyboardOffset();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCampaignSheetOpen, setIsCampaignSheetOpen] = useState(false);
  const [text, setText] = useState("");
  const [canResuggest, setCanResuggest] = useState(false);

  const setProposalData = useCampaignProposalStore((state) => state.setProposalData);

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

  // 재제안 가능 여부 확인 (나의 제안 내역이 있는지)
  useEffect(() => {
    const checkResuggest = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const data = await getMyCollaborations({
          type: "SENT",
          status: "REVIEWING",
          endDate: today,
        });
        setCanResuggest(data && data.length > 0);
      } catch (error) {
        console.error("Failed to check resuggest status:", error);
      }
    };
    checkResuggest();
  }, []);

  const partnerName = detail?.opponentName ?? "";
  const partnerAvatarUrl = detail?.opponentProfileImageUrl ?? "";
  const collabTitle = detail?.campaignSummary?.campaignTitle ?? "";
  const collabSubtitle = detail?.campaignSummary?.brandName ?? "";
  const collabThumb = detail?.campaignSummary?.campaignImageUrl ?? partnerAvatarUrl;
  const summaryBarHeight = detail?.campaignSummary ? 64 : 0;


  const actions: AttachmentAction[] = useMemo(
    () => [
      {
        key: "suggest",
        label: canResuggest ? "재 제안" : "제안 하기",
        icon: canResuggest ? "refresh" : "suggest",
      },
      { key: "image", label: "이미지", icon: "image" },
      { key: "file", label: "첨부파일", icon: "file" },
    ],
    [canResuggest],
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
        <LoadingSpinner className="py-6" />
      </div>
    );
  }

  return (
    <div className="h-screen-full bg-gradient-to-b from-[#F6F6FF] via-[#F3F3FA] to-[#E8E8FB] overflow-x-hidden">
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
          height: `calc(100vh - 60px - 49px - ${summaryBarHeight}px - ${isSheetOpen ? sheetHeight : 0
            }px - ${kb}px)`,
        }}
      >
        <div className="w-full">
          <div className="w-full space-y-2">

            {/* 채팅마다 나오는 말풍선 (Bubble) */}
            {messages.map((m, idx) => {
              const isMe = m.senderType === "USER" && m.senderId === myUserId;
              const { dateText, timeText } = formatKoreanDateTime(m.createdAt);
              const messageKey = m.clientMessageId || m.messageId || `${m.roomId}-${m.createdAt}`;

              const prev = idx > 0 ? messages[idx - 1] : null;
              const isSameSender = prev && prev.senderId === m.senderId && prev.senderType === m.senderType;
              const showAvatar = !isMe && !isSameSender;

              return (
                <MessageRenderer
                  key={messageKey}
                  message={m}
                  timeText={`${dateText}\n${timeText}`}
                  avatarSrc={showAvatar ? partnerAvatarUrl : undefined}
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
          if (key === "suggest") {
            if (canResuggest) {
              setIsCampaignSheetOpen(true);
            } else {
              navigate("/matching/suggest");
            }
          }
          setIsSheetOpen(false);
        }}
        height={sheetHeight}
      />

      {/* 캠페인 재 제안하기 버튼 */}
      <CampaignProposalBottomSheet
        isOpen={isCampaignSheetOpen}
        onClose={() => setIsCampaignSheetOpen(false)}
        brandId={detail?.brandId}
        onSelect={(campaign) => {
          setProposalData({
            proposalId: campaign.proposalId,
            campaignId: campaign.campaignId,
            brandId: detail?.brandId || campaign.brandId,
            campaignTitle: campaign.title,
            campaignDescription: campaign.description,
            rewardAmount: campaign.rewardAmount,
            product: String(campaign.productId),
            startDate: campaign.startDate ?? undefined,
            endDate: campaign.endDate ?? undefined,
            contentTags: campaign.contentTags,
            domain: "test",
          });
          navigate("/chat/resuggest");
        }}
      />
    </div>
  );
}
