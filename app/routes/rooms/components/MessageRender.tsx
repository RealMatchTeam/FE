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
};

export default function MessageRenderer({
  message,
  timeText,
  avatarSrc,
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
      const att = message.attachment;
      if (!att) return null;

      return (
        <AttachmentMessage
          avatarSrc={avatarSrc}
          senderId={message.senderId}
          createdAt={timeText ?? message.createdAt}
          attachmentType={att.attachmentType}
          contentType={att.contentType}
          originalName={att.originalName}
          accessUrl={att.accessUrl}
          status={att.status}
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
          const status = sys.payload?.status ?? sys.payload?.status;

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
          const status = sys.payload?.status ?? sys.payload?.status;

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