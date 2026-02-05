import TextMessage from "./Bubbles/TextMessage";
import ProposalMessage from "./Bubbles/ProposalMessage";
import MatchingMessage from "./Bubbles/MatchingMessage";
import { CHAT_NOTICE_TEXT } from "./Bubbles/SystemEventMessage";
import AttachmentMessage from "./Bubbles/AttachmentMessage";
import type { ChatMessage } from "../api/rooms";
import ChatNoticeMessage from "./Bubbles/SystemEventMessage";

type Props = {
  message: ChatMessage;
  timeText?: string;
  avatarSrc?: string;
  isCollaborating?: boolean;
};

export default function MessageRenderer({
  message,
  timeText,
  avatarSrc,
  isCollaborating,
}: Props) {

  switch (message.messageType) {
    case "TEXT": {
      if (!message.content) return null;

      return (
        <TextMessage
          senderId={message.senderId}
          senderType={message.senderType}
          messageType={message.messageType}
          content={message.content}
          createdAt={timeText ?? message.createdAt}
          avatarSrc={avatarSrc}
        />
      );
    }

    case "IMAGE":
    case "FILE": {
      return (
        <AttachmentMessage
          avatarSrc={avatarSrc}
          senderId={message.senderId}
          createdAt={timeText ?? message.createdAt}
          attachmentType={message.attachment?.attachmentType!}
          contentType={message.attachment?.contentType!}
          originalName={message.attachment?.originalName!}
          accessUrl={message.attachment?.accessUrl!}
          status={message.attachment?.status!}
        />
      );
    }

    case "SYSTEM": {
      const sys = message.systemMessage;
      if (!sys) return null;

      switch (sys.kind) {
        case "PROPOSAL_CARD":
        case "RE_PROPOSAL_CARD":
          return (
            <ProposalMessage
              kind={sys.kind}
              createdAt={timeText ?? message.createdAt}
              avatarSrc={avatarSrc}
              campaignName={sys.payload.campaignName}
              bodyText={sys.payload.campaignSummary}
              proposalDirection={sys.payload.proposalDirection}
            />
          )

        case "MATCHED_CAMPAIGN_CARD":
          return (
            <MatchingMessage
              campaignName={sys.payload.campaignName}
              amount={sys.payload.amount}
              orderNumber={sys.payload.orderNumber}
              createdAt={timeText ?? message.createdAt}
              avatarSrc={avatarSrc}
            />
          )

        case "APPLY_CARD":
        return (
          <ProposalMessage
            kind={sys.kind}
            createdAt={timeText ?? message.createdAt}
            avatarSrc={avatarSrc}
            campaignName={sys.payload.campaignName}
            bodyText={sys.payload.applyReason} 
            proposalDirection={"NONE"}
          />
        );

        case "PROPOSAL_STATUS_NOTICE": {
          const status = sys.payload?.status ?? sys.payload?.proposalStatus;

          if (isCollaborating) { // 둘 중에 뭘 써야하는지?
            return <ChatNoticeMessage text={CHAT_NOTICE_TEXT.PROPOSAL_ACCEPTED} />;
          }

          if (status === "ACCEPTED") {
            return <ChatNoticeMessage text={CHAT_NOTICE_TEXT.PROPOSAL_ACCEPTED} />;
          }

          if (status === "REJECTED") {
            return <ChatNoticeMessage text={CHAT_NOTICE_TEXT.PROPOSAL_REJECTED} />;
          }

          if (status === "CANCELED") {
            return <ChatNoticeMessage text={CHAT_NOTICE_TEXT.PROPOSAL_CANCELED} />;
          }

          return <ChatNoticeMessage text={CHAT_NOTICE_TEXT.DEFAULT} />;
        }

        case "APPLY_STATUS_NOTICE": {
          const status = sys.payload?.status ?? sys.payload?.applyStatus;

          if (isCollaborating) {
            return <ChatNoticeMessage text={CHAT_NOTICE_TEXT.APPLY_ACCEPTED} />;
          }

          if (status === "ACCEPTED") {
            return <ChatNoticeMessage text={CHAT_NOTICE_TEXT.APPLY_ACCEPTED} />;
          }

          if (status === "REJECTED") {
            return <ChatNoticeMessage text={CHAT_NOTICE_TEXT.APPLY_REJECTED} />;
          }

          if (status === "CANCELED") {
            return <ChatNoticeMessage text={CHAT_NOTICE_TEXT.APPLY_CANCELED} />;
          }

          return <ChatNoticeMessage text={CHAT_NOTICE_TEXT.DEFAULT} />;
        }

        default:
          return null;
      }
    }

    default:
      return null;
  }
}