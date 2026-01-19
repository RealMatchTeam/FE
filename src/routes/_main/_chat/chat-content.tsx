import Header from "../../../components/layout/Header";
import { useState, useMemo, useContext, useEffect } from "react";
import { LayoutContext } from "../../_main";
import { type SortOption, SORT_LABEL } from "./types/SortOption";
import { rooms } from "./data/mockData";
import ChatListHeader from "./components/ChatListHeader";
import SortFilterSheet from "./components/SortingSheet";
import ChatList from "./components/ChatList";
import { EmptyChatState } from "./components/EmptyState";

function ChatPage() {
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

export default ChatPage;