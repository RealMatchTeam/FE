import { useState, useMemo } from "react";
import { SORT_LABEL, type SortOption } from "./components/SortingSheetConstant";
import { rooms } from "../../data/chat-room";
import { ChatListHeader } from "./components/ChatListHeader";
import SortFilterSheet from "./components/SortingSheet";
import ChatList from "./ChatList";
import { EmptyChatState } from "./components/EmptyState";
import { useHideBottomTab } from "../../hooks/useHideBottomTab";

function ChatPage() {
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent"); // 보낸 제안 / 받은 제안 탭
  const [isSortOpen, setIsSortOpen] = useState(false); // 정렬 바텀시트
  const [sort, setSort] = useState<SortOption>("latest"); // 최신순 / 협업중만
  const [pendingSort, setPendingSort] = useState<SortOption>(sort); // 바텀시트에서 고른 값

  // 바텀탭 숨기기 (바텀시트 열렸을 때)
  useHideBottomTab(isSortOpen);

  // 받은/보낸 필터
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => room.type === activeTab);
  }, [activeTab]);

  // 정렬 + (필요시) 협업중 필터
  const sortedRooms = useMemo(() => {
    let filtered = filteredRooms;

    // 협업중만 보기
    if (sort === "collaborating") {
      filtered = filteredRooms.filter((room) => room.isCollaborating);
    }

    const copy = [...filtered];
    copy.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return copy;
  }, [filteredRooms, sort]);

  const openSortSheet = () => {
    setPendingSort(sort);
    setIsSortOpen(true);
  };

  const applySort = () => {
    setSort(pendingSort);
    setIsSortOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F6FF] via-[#F3F3FA] to-[#E8E8FB]">
      <main className="p-4 pb-16">
        <ChatListHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sortLabel={SORT_LABEL[sort]}
          onClickSort={openSortSheet}
          sortOpen={isSortOpen}
        />

        {sortedRooms.length === 0 ? <EmptyChatState /> : <ChatList rooms={sortedRooms} />}
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

export default ChatPage;