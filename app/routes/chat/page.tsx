import { useCallback, useState, useEffect } from "react";
import { SORT_LABEL, type SortOption } from "./components/ChatSortFilterConstant";
import { ChatListHeader } from "./components/ChatListHeader";
import SortFilterSheet from "./components/ChatSortFilterSheet";
import ChatListCard from "./components/ChatListCard";
import { EmptyPage } from "./components/EmptyPage";
import { useHideBottomTab } from "../../hooks/useHideBottomTab";
import { useDebounce } from "../../hooks/useDebounce";
import { getChatRooms, type ChatRoomCard } from "./api/chat";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function ChatPage() {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>("latest");
  const [pendingSort, setPendingSort] = useState<SortOption>(sort); // 바텀시트에서 고른 값
  const [hasApplied, setHasApplied] = useState(false); // 적용하기 누른 적 있는지
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 (입력용)

  const [rooms, setRooms] = useState<ChatRoomCard[]>([]);
  const [loading, setLoading] = useState(false);

  // 검색어 디바운스 (100ms)
  const debouncedQuery = useDebounce(searchQuery, 100);

  // 바텀탭 숨기기
  useHideBottomTab(isSortOpen);


  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getChatRooms({
        status: sort === "collaborating" ? "COLLABORATING" : "LATEST",
        search: debouncedQuery.trim() || undefined,
      });
      setRooms(Array.isArray(data.rooms) ? data.rooms : []);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, [sort, debouncedQuery]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const openSortSheet = () => {
    setPendingSort(sort);
    setIsSortOpen(true);
  };

  const applySort = () => {
    setSort(pendingSort);
    setHasApplied(true);
    setIsSortOpen(false);
  };

  return (
    <div className="h-full bg-gradient-to-b from-[#F6F6FF] via-[#F3F3FA] to-[#E8E8FB]">
      <main className="p-4 pb-16">
        <ChatListHeader
          sortLabel={SORT_LABEL[sort]}
          isFiltered={hasApplied}
          onClickSort={openSortSheet}
          sortOpen={isSortOpen}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {loading ? (
          <LoadingSpinner className="py-10" />
        ) : rooms.length === 0 ? (
          <EmptyPage />
        ) : (
          <div className="flex flex-col gap-[10px]">
            {rooms.map((room) => (
              <ChatListCard key={room.roomId} room={room} />
            ))}
          </div>
        )}
      </main>

      <SortFilterSheet
        open={isSortOpen}
        value={pendingSort}
        onChange={setPendingSort}
        onClose={() => setIsSortOpen(false)}
        onApply={applySort}
        titleClassName="text-[14px] font-semibold"
        optionClassName="text-[12px]"
        applyButtonClassName="text-[13px] font-semibold"
      />
    </div>
  );
}
