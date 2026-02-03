import { type ChatMessage_UI } from "../types/ChatMessage_UI";

type Props = {
  message: ChatMessage_UI;
  timeText: string;
  onRetry: (messageId: string) => void;
  onDelete: (messageId: string) => void;
};

function MessageStatus({
  onRetry,
  onDelete,
}: {
  onRetry: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="shrink-0 w-[40px] h-[22px] rounded-[6px] bg-[#6666E5] flex overflow-hidden">
      <button
        type="button"
        onClick={onRetry}
        className="w-1/2 h-full grid place-items-center"
        aria-label="retry"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
            d="M20 12a8 8 0 10-2.34 5.66"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
        <path
            d="M20 7v5h-5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        </svg>
      </button>

      <div className="w-px h-full bg-white/30" />

      <button
        type="button"
        onClick={onDelete}
        className="w-1/2 h-full grid place-items-center"
        aria-label="delete"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
            d="M6 6l12 12M18 6L6 18"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
        </svg>
      </button>
    </div>
  );
}

export default function MessageMeta({ message, timeText, onRetry, onDelete }: Props) {
  if (message.status === "failed") {
    return (
      <MessageStatus
        onRetry={() => onRetry(message.id)}
        onDelete={() => onDelete(message.id)}
      />
    );
  }

  if (message.status === "sent") {
    return timeText ? (
      <div className="shrink-0 text-[10px] leading-[12px] text-[#9B9BA1] whitespace-pre-line">
        {timeText}
      </div>
    ) : null;
  }

  // sending이면 아무것도 안 보임
  return null;
}