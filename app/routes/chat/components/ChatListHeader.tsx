import searchIcon from "../../../assets/search2.svg";
import closeIcon from "../../../assets/cancel.svg";

export function ChatListHeader({
  sortLabel,
  onClickSort,
  searchQuery,
  onSearchChange,
}: {
  sortLabel: string;
  onClickSort: () => void;
  sortOpen: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) {

  return (

    <div className="flex flex-col gap-4 border-b border-text-gray5">

      {/* 검색 입력창 */}
      <div className="flex items-center w-full bg-bg-w border border-core-2 rounded-[8px] px-3 py-2 overflow-hidden">
        <img src={searchIcon} alt="search" className="w-4 h-4 flex-shrink-0 opacity-40" />

        <input
          className="flex-1 min-w-0 bg-transparent mx-2 outline-none text-body1 text-center placeholder:text-text-gray3"
          placeholder="검색어 입력"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <button
          type="button"
          onClick={() => onSearchChange("")}
          className="shrink-0 w-4 h-4 flex items-center justify-center"
        >
          <img src={closeIcon} alt="close" className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center pt-2 pb-4 justify-between">

        <div className="px-1 text-[16px] leading-[20px] font-Semibold text-black">
          채팅 목록
        </div>

        {/* 정렬 버튼 - 텍스트는 sortLabel */}
        <button
          onClick={onClickSort}
          className="flex items-center gap-1 w-fit h-7 px-3 rounded-full border border-[#E6E6F3] text-[#5B5D6B] text-[14px] font-Pretendard text-text-gray2 bg-white"
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
    </div>
  );
}

export default ChatListHeader;
