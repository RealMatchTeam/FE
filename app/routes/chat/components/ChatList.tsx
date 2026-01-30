import { type ChatRoom } from "../types/ChatRoom";
import { formatKoreanDateTime } from "../../../../utils/dateTime";
import { useNavigate } from "react-router";

export function ChatList({ rooms }: { rooms: ChatRoom[] }) {
  return (
    <div className="flex flex-col gap-[10px]">
      {rooms.map((room) => (
        <ChatListItem key={room.id} room={room} />
      ))}
    </div>
  );
}

export function ChatListItem({ room }: { room: ChatRoom }) {
  const statusLabel =
    room.status === "matching" ? "매칭" : room.status === "reviewing" ? "검토 중" : "거절";

  // 뱃지 톤: 매칭=보라, 검토중=연보라, 거절=그레이
  const statusClass =
    room.status === "matching"
      ? "bg-[#E6E6F3] text-[#6666E5]"
      : room.status === "reviewing"
        ? "bg-[#EBEEFB] text-[#A7B8FC]"
        : "bg-[#F3F3F3] text-text-gray3";

  const { dateText, timeText } = formatKoreanDateTime(room.updatedAt);

  const navigate = useNavigate();

  return (
    <button
      type="button"
      className=" w-full max-w-[420px] rounded-[10px] bg-white px-4 py-[14px] flex items-start gap-[14px] text-left"
      onClick={() =>
        navigate({
          to: "/rooms/$chatId",
          params: { chatId: String(room.id) },
        })
      }
    >
      {/* 왼쪽 로고 */}
      <div className="w-[43px] h-[43px] rounded-[10px] bg-white border border-[#E6E6F3] flex items-center justify-center overflow-hidden shrink-0">
        {room.logoUrl ? (
          <img
            src={room.logoUrl}
            alt={`${room.brandName} 로고`}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-callout3 text-text-gray3">
            {room.brandName.slice(0, 2)}
          </span>
        )}
      </div>

      {/* 중간 텍스트 영역 */}
      <div className="w-[227px] min-w-0">
        {/* 1줄: 브랜드명 + 상태 뱃지 */}
        <div className="flex items-center gap-2">
          <div className="text-title1 text-text-black font-Pretendard truncate">
            {room.brandName}
          </div>

          <span
            className={`
              ${statusClass}
              text-[10px]
              text-Medium
              px-[6px] py-[2px]
              rounded-[5px]
              shrink-0
            `}
          >
            {statusLabel}
          </span>
        </div>

        {/* 2줄 미리보기 */}
        <div className="text-[12px] mt-2.5 text-Medium text-text-gray3 line-clamp-2">
          {room.lastMessage}
        </div>
      </div>

      {/* 오른쪽 영역: unread + 날짜/시간 */}
      <div className="flex flex-col items-end justify-between w-[68px] h-[65px] shrink-0">
        {/* 안 읽음 배지 */}
        {room.unreadCount > 0 ? (
          <div className="w-[20px] h-[20px] rounded-full bg-[#6666E5] text-[14px] text-white text-Semibold flex items-center justify-center">
            {room.unreadCount}
          </div>
        ) : (
          <div className="w-5 h-5" />
        )}

        {/* 날짜/시간 */}
        <div className="text-Medium text-[10px] text-[#A0A0A0] text-right leading-tight">
          <div>{dateText}</div>
          <div>{timeText}</div>
        </div>
      </div>
    </button>
  );
}

export default ChatList;