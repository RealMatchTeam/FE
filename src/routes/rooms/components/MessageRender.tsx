import TextMessage from "./Bubbles/TextMessage";
import { type TextMessageProps } from "./Bubbles/TextMessageTypes";
import ProposalMessage from "./Bubbles/ProposalMessage";
import MatchingMessage from "./Bubbles/MatchingMessage";
import SystemEventMessage from "./Bubbles/SystemEventMessage";
import { CHAT_NOTICE_TEXT } from "./Bubbles/SystemEventMessage";
import AttachmentMessage from "./Bubbles/AttachmentMessage";

export default function MessageRenderer({ message }: TextMessageProps) {

  switch (message.type) {
    case "TEXT":
      return (<TextMessage message={message} />);

    case "PROPOSAL":
      return <ProposalMessage message={message} />;

    case "MATCHED_CAMPAIGN":
      return <MatchingMessage message={message} />;

    case "SYSTEM_MATCHED":
      return (<SystemEventMessage text={CHAT_NOTICE_TEXT.MATCHED} />);

    case "SYSTEM_ACCEPTED":
    return (<SystemEventMessage text={CHAT_NOTICE_TEXT.ACCEPTED} />);

    case "SYSTEM_REJECTED":
    return (<SystemEventMessage text={CHAT_NOTICE_TEXT.REJECTED} />);

    case "IMAGE":
    case "FILE":
    return <AttachmentMessage message={message} />;

    default:
      return null;
  }
}