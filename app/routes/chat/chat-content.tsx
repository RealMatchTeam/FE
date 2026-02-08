import { useCallback, useState } from "react";
import { SORT_LABEL, type SortOption } from "./components/SortingSheetConstant";
import { useEffect } from "react";
import { ChatListHeader } from "./components/ChatListHeader";
import SortFilterSheet from "./components/SortingSheet";
import ChatList from "./ChatList";
import { EmptyChatState } from "./components/EmptyState";
import { useHideBottomTab } from "../../hooks/useHideBottomTab";
import { getChatRooms, type ChatRoomCard } from "./api/chat";

function ChatPage() {
  const [isSortOpen, setIsSortOpen] = useState(false); // 정렬 바텀시트
  const [sort, setSort] = useState<SortOption>("latest"); // 최신순 / 협업중만
  const [pendingSort, setPendingSort] = useState<SortOption>(sort); // 바텀시트에서 고른 값

  const [rooms, setRooms] = useState<ChatRoomCard[]>([]);
  const [loading, setLoading] = useState(false);

  // 바텀탭 숨기기
  useHideBottomTab(isSortOpen);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getChatRooms({
        status: sort === "collaborating" ? "COLLABORATING" : "LATEST",
      });
      setRooms(Array.isArray(data.rooms) ? data.rooms : []);
    } catch {
      setRooms([]); 
    } finally {
      setLoading(false);
    }
  }, [sort]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

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
          sortLabel={SORT_LABEL[sort]}
          onClickSort={openSortSheet}
          sortOpen={isSortOpen}
        />

        {!loading && rooms.length === 0 ? (
          <EmptyChatState />
        ) : (
          <ChatList rooms={rooms} />
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
