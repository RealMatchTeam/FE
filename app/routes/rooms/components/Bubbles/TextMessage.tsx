import { tokenStorage } from "../../../../lib/token";

type Props = {
  //messageId: number;
  //roomId: number;
  senderId: number | null;
  senderType: "USER" | "SYSTEM";
  messageType: "TEXT" | "IMAGE" | "FILE" | "SYSTEM";
  content: string | null;
  createdAt: string;
  avatarSrc?: string;
};


export default function TextMessage ({
  senderId,
  senderType,
  messageType,
  content,
  createdAt,
  avatarSrc,
}: Props) {
  const myId = Number(tokenStorage.getUserId() ?? 0);

  if (messageType !== "TEXT") return null;

  const isMe = senderType === "USER" && senderId === myId;
  const isLeft = !isMe;
  const timeText = createdAt ?? "";

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
            {content}
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
            style={{ width: 38, height: 38 }}
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
                {content}
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

  