
export function ChatListHeader({
  activeTab,
  setActiveTab,
  sortLabel,
  onClickSort,
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

export default ChatListHeader;