import { type ChatMessage } from "./TextMessageTypes";

type Props = {
  message: ChatMessage;
};

export default function TextMessage ({ message }: Props) {
  if (message.type !== "TEXT") return null;

  const isMe = message.side === "me";
  const isLeft = message.side === "other" || message.side === "system";

  const timeText = message.time ?? "";

  const avatarSrc = message.avatarSrc; //임시

  if (isMe) {
    return (
      <div className="flex w-full justify-end">
        <div className="inline-flex items-end gap-[8px]">
          {timeText ? (
            <div className="text-[10px] leading-[12px] text-[#9B9BA1] text-right whitespace-pre-line">
              {timeText}
            </div>
          ) : null
          }

          {<div className="w-fit max-w-[240px] px-[10px] py-[10px] rounded-[10px] bg-[#B7B7F380] text-black text-[12px] leading-[16px] style-black break-words whitespace-pre-line"> 
            {message.content}
          </div>
          } 
        </div>
      </div>
    );
  }

  // 상대/브랜드 자동(system) 채팅 (왼쪽 + 프로필)
  if (isLeft) {
    return (
      <div className="flex justify-start">
        <div className="w-fit flex items-start gap-[10px] max-w-full">
          {/* avatar */}
          <div
            className="shrink-0 rounded-[10px] bg-white overflow-hidden"
            style={{ width: message.avatarSize, height: message.avatarSize }}
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="avatar"
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-[12px] text-[#5B5D6B]">
                logo
              </div>
            )}
          </div>

          { /*bubble + time*/ }
          <div className="flex justify-start">
            <div className="flex items-end gap-[8px] max-w-[calc(100%-48px)]">
              <div className="w-fit max-w-[240px] rounded-[10px] bg-[#FFFFFFCC] px-[10px] py-[10px] text-[12px] leading-[16px] text-Medium text-black break-words whitespace-pre-line">
                {message.content}
              </div>

              {timeText ? (
                <div className="shrink-0 text-[10px] leading-[12px] text-[#9B9BA1] whitespace-pre-line">
                  {timeText}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

  