import TextMessage from "./Bubbles/TextMessage";
import { type TextMessageProps } from "./Bubbles/TextMessageTypes";

export default function MessageRenderer({ message, avatarSrc, avatarSize }: TextMessageProps) {
  switch (message.type) {
    case "TEXT":
      return (
        <TextMessage 
          message={message}
          avatarSrc={avatarSrc}
          avatarSize={avatarSize}
        />
      );
    default:
      return null;
  }
}