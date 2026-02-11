import { formatKoreanDateTime } from "@utils/dateTime";
import { useNavigate } from "react-router-dom";

export default function ChatListCard({ room }: { room: ChatRoomCard }) {
  const { dateText, timeText } = formatKoreanDateTime(room.lastMessageAt);
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className=" w-full rounded-[10px] bg-white px-4 py-[14px] flex items-start gap-[14px] text-left active:bg-[#F2F2F5]"
      onClick={() => navigate(`/rooms/${room.roomId}`)}
    >
      {/* 왼쪽 로고 */}
      <div className="w-[43px] h-[43px] rounded-[10px] bg-white border border-[#E6E6F3] flex items-center justify-center overflow-hidden shrink-0">
        {room.opponentProfileImageUrl ? (
          <img
            src={room.opponentProfileImageUrl}
            alt={`${room.opponentName} 로고`}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-callout3 text-text-gray3">
            {room.opponentName.slice(0, 2)}
          </span>
        )}
      </div>

      {/* 중간 텍스트 영역 */}
      <div className="flex-1 min-w-0">
        {/* 1줄: 브랜드명 + 상태 뱃지 */}
        <div className="flex items-center gap-2">
          <div className="text-title1 text-text-black font-Pretendard truncate">
            {room.opponentName}
          </div>

          {room.isCollaborating && (
            <span
              className={`
                bg-[#B7B7F380] text-[#6666E5]
                text-[10px]
                text-Medium
                px-[6px] py-[2px]
                rounded-[5px]
                shrink-0
              `}
            >
              협업 중
            </span>
            )}
        </div>

        {/* 2줄 미리보기 */}
        <div className="text-[12px] mt-2.5 text-Medium text-text-gray3 line-clamp-2">
          {room.lastMessagePreview}
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

export function ChatListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-[10px]">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full rounded-[10px] bg-white px-4 py-[14px] flex items-start gap-[14px]"
        >
          {/* 왼쪽 로고 */}
          <div className="w-[43px] h-[43px] rounded-[10px] bg-[#F2F2F5] shrink-0 animate-pulse" />

          {/* 중간 텍스트 */}
          <div className="flex-1 min-w-0">
            <div className="h-[16px] w-[100px] bg-[#F2F2F5] rounded-[4px] animate-pulse" />
            <div className="h-[12px] w-[180px] bg-[#F2F2F5] rounded-[4px] mt-2.5 animate-pulse" />
            <div className="h-[12px] w-[120px] bg-[#F2F2F5] rounded-[4px] mt-1 animate-pulse" />
          </div>

          {/* 오른쪽 */}
          <div className="flex flex-col items-end justify-between w-[68px] h-[65px] shrink-0">
            <div className="w-[20px] h-[20px] rounded-full bg-[#F2F2F5] animate-pulse" />
            <div className="h-[10px] w-[50px] bg-[#F2F2F5] rounded-[4px] animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}