import searchIcon from "../../../assets/search2.svg";
import closeIcon from "../../../assets/cancel.svg";

export function ChatListHeader({
  sortLabel,
  isFiltered = false,
  onClickSort,
  searchQuery,
  onSearchChange,
}: {
  sortLabel: string;
  isFiltered?: boolean;
  onClickSort: () => void;
  sortOpen: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) {

  return (

    <div className="flex flex-col gap-4">

      {/* 검색 입력창 */}
      <div className="flex items-center w-full bg-bg-w border border-core-2 rounded-[8px] px-3 py-2 overflow-hidden">
        <img src={searchIcon} alt="search" className="w-4 h-4 flex-shrink-0 opacity-40" />

        <input
          className="flex-1 min-w-0 bg-transparent mx-2 outline-none text-body1 text-center placeholder:text-text-gray3"
          placeholder="채팅 검색"
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

        <div className="px-1 text-title1 leading-[20px] text-black">
          채팅 목록
        </div>

        {/* 정렬 버튼 - 텍스트는 sortLabel */}
        <button
          onClick={onClickSort}
          className={`flex items-center w-fit h-7 pl-3 pr-1.5 rounded-full border text-[14px] font-medium text-[#5B5D6B] ${
            isFiltered
              ? "border-core-70 text-core-1 bg-core-70"
              : "border-core-2 text-gray-2 bg-white text-medium"
          }`}
        >
          {sortLabel}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="none"
            className={`w-6 h-6 ${isFiltered ? "text-core-1" : "text-text-gray2"}`}
          >
            <path
              d="M6 8L10 12L14 8"
              stroke="currentColor"
              strokeWidth="1.0"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ChatListHeader;
