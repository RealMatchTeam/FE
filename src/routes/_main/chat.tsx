import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/layout/Header";
import { useState, useMemo, useContext, useEffect } from "react";
import { LayoutContext } from "../_main";


export const Route = createFileRoute("/_main/chat")({
  component: ChatPage,
});

// 타입 ======================================================
type RoomStatus = "matching" | "reviewing" | "rejected";

type ChatRoom = {
  id: string;
  brandName: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
  status: RoomStatus;
  logoUrl: string; 
  type: "sent" | "received";
};

// 정렬, 필터 옵션 (최신순/매칭/검토중/거절)
type SortOption = "latest" | "matching" | "reviewing" | "rejected";

const SORT_LABEL: Record<SortOption, string> = {
  latest: "최신순",
  matching: "매칭",
  reviewing: "검토중",
  rejected: "거절",
};

// 함수 ======================================================

function ChatPage() {
  const rooms: ChatRoom[] = [
    {
      id: "1",
      brandName: "비플레인",
      lastMessage: "안녕하세요! 제안 확인 부탁드립니다.안녕하세요 제안 확인 부탁드립니다 안녕하세요 제안 확인 부탁드립니다 안녕하세요 제안 확인 부탁드립니다",
      updatedAt: new Date().toISOString(),
      unreadCount: 2,
      status: "matching",
      logoUrl: "",
      type: "sent",
    },
    {
      id: "2",
      brandName: "라운드랩",
      lastMessage: "검토 중입니다!",
      updatedAt: "2025-01-05T10:00:00",
      unreadCount: 0,
      status: "reviewing",
      logoUrl: "",
      type: "received",
    },
  ];// TODO: API 연결 전 임시 더미 데이터

  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent"); // 보낸 제안 / 받은 제안 탭
  const [isSortOpen, setIsSortOpen] = useState(false);    // 정렬 바텀시트
  const [sort, setSort] = useState<SortOption>("latest"); // 현재 선택된 정렬 옵션
  const [pendingSort, setPendingSort] = useState<SortOption>(sort); // 바텀시트에서 고른 값
  const layout = useContext(LayoutContext); // 레이아웃

  useEffect(() => {
    if (!layout) return;

    layout.setHideBottomTab(isSortOpen);

    return () => {
      layout.setHideBottomTab(false);
    };
  }, [isSortOpen, layout]);

  // 받은제안/보낸제안 필터
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => room.type === activeTab);
  }, [rooms, activeTab]);

  // 정렬 적용
  const sortedRooms = useMemo(() => {
    
    // 받은/보낸 필터링
    let filtered = filteredRooms;

    // latest가 아니면 status로 한 번 더 필터
    if (sort !== "latest") {
      filtered = filteredRooms.filter((room) => room.status === sort);
    }
    
    const copy = [...filtered];
    copy.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return copy;
  }, [filteredRooms, sort]);

  const openSortSheet = () => {
    setPendingSort(sort); // 열 때 현재 적용값으로
    setIsSortOpen(true);
  };

  const applySort = () => {
    setSort(pendingSort); // 기준 적용
    setIsSortOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F6FF] via-[#F3F3FA] to-[#E8E8FB]">
      <Header title="채팅" />
      <main className="p-4 pb-16">
        <ChatListHeader 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sortLabel={SORT_LABEL[sort]}
          onClickSort={openSortSheet}
          sortOpen={isSortOpen}
        />

        {sortedRooms.length === 0 ? (
          <EmptyChatState />
        ) : (
          <ChatList rooms={sortedRooms} />
        )}
      </main>

      <SortFilterSheet
        open={isSortOpen}
        value={pendingSort}
        onChange={setPendingSort}
        onClose={() => setIsSortOpen(false)}
        onApply={applySort}
      />
    </div>
  );
}

function ChatListHeader({
  activeTab,
  setActiveTab,
  sortLabel,
  onClickSort,
  sortOpen,
}: {
  activeTab: "sent" | "received";
  setActiveTab: (tab: "sent" | "received") => void;
  sortLabel: string;
  onClickSort: () => void;
  sortOpen: boolean;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      {/* 탭 */}
      <div className="flex gap-4">
        <button className={`
          text-Medium
          ${activeTab === "sent" ? "!text-[#6666E5]" : "text-gray3"}
          `}
          onClick={() => setActiveTab("sent")}
        >
          보낸 제안
        </button>
        <button className={`
          text-Medium
          ${activeTab === "received" ? "!text-[#6666E5]" : "text-gray3"}
          `}
          onClick={() => setActiveTab("received")}
        >
          받은 제안
        </button>
      </div>

      {/* 정렬 버튼 - 텍스트는 sortLabel */}
      <button
        onClick={onClickSort}
        className="flex items-center gap-1 w-fit h-7 px-3 rounded-full border border-text-[#E6E6F3] text-[14px] font-Pretendard text-text-gray2 bg-white"
      >
        {sortLabel}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 text-text-gray3"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

function SortFilterSheet({
  open,
  value,
  onChange,
  onClose,
  onApply,
}: {
  open: boolean;
  value: SortOption;
  onChange: (v: SortOption) => void;
  onClose: () => void;
  onApply: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* 딤(배경) */}
      <button
        type="button"
        aria-label="close"
        className="absolute inset-0 bg-[#17171833]"
        onClick={onClose}
      />

      {/* 시트 */}
      <div className="fixed left-1/2 -translate-x-1/2 top-[235px] w-full max-w-[430px] h-[530px] bg-white rounded-t-[12px] pt-[20px] px-4 flex flex-col">
        <div className="w-full max-w-[430px] h-[70px] fixed left-1/2 -translate-x-1/2"> 
          <div className="px-4 text-Medium text-text-black mb-3">정렬 필터</div>

          <div className="bg-[#F3F4F8] px-4 py-3">
            <div className="flex gap-6">
              <SortOptionButton
                label="최신순"
                active={value === "latest"}
                onClick={() => onChange("latest")}
              />
              <SortOptionButton
                label="매칭"
                active={value === "matching"}
                onClick={() => onChange("matching")}
              />
              <SortOptionButton
                label="검토중"
                active={value === "reviewing"}
                onClick={() => onChange("reviewing")}
              />
              <SortOptionButton
                label="거절"
                active={value === "rejected"}
                onClick={() => onChange("rejected")}
              />
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <div className="px-4 pb-6">
          <button
            onClick={onApply}
            className="w-full max-w-[420px] h-11 rounded-[12px] bg-[#6666E5] text-white text-SemiBold"
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
}

function SortOptionButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-Medium ${active ? "text-text-black" : "text-text-gray3"}`}
    >
      {label}
    </button>
  );
}

function EmptyChatState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h3 className="text-title text-text-gray2 mb-2">채팅방이 없어요</h3>
      <p className="text-body1 text-text-gray3 text-center">
        매칭이 성사되면 채팅을 시작할 수 있어요
      </p>
    </div>
  );
}

function ChatList({ rooms }: { rooms: ChatRoom[] }) {
  return (
    <div className="flex flex-col gap-[10px]">
      {rooms.map((room) => (
        <ChatListItem key={room.id} room={room} />
      ))}
    </div>
  );
}

// 채팅 리스트 ==============================================================

function ChatListItem({ room }: { room: ChatRoom }) {
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

  return (
    <button
      type="button"
      className=" w-full max-w-[420px] rounded-[10px] bg-white px-4 py-[14px] flex items-start gap-[14px] text-left"
      // TODO: onClick={() => navigate({ to: `/chat/${room.id}` })}
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

/**
 * updatedAt을 "25.01.06", "14:00" 형태로 만들기
 * (updatedAt이 ISO 문자열이라고 가정)
 */
function formatKoreanDateTime(updatedAt: string) {
  const d = new Date(updatedAt);

  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");

  return {
    dateText: `${yy}.${mm}.${dd}`,
    timeText: `${hh}:${min}`,
  };
}