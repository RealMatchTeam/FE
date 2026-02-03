import { useState } from "react";
import searchIcon from "../../../assets/search2.svg";
import closeIcon from "../../../assets/cancel.svg"; 

interface Props {
  subTab: "sent" | "received" | "applied";
  setSubTab: (tab: "sent" | "received" | "applied") => void;
  receivedCount?: number; // 받은 제안 개수를 동적으로 표시하기 위한 옵션
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-[14px] font-bold transition-all ${
        active 
          ? "bg-core-1 text-white" 
          : "bg-white border border-text-gray5 text-text-gray3"
      }`}
    >
      {label}
    </button>
  );
}


export default function MatchingTabSection({ subTab, setSubTab, receivedCount }: Props) {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");

  if (isSearching) {
    return (
      <div className="flex items-center w-full px-4 py-3 animate-slide-up">
        {/* 검색창 컨테이너 */}
        <div className="flex items-center w-full relative bg-bg-w border border-core-2 rounded-[8px] px-3 py-2">
          {/* 돋보기 아이콘 */}
          <img src={searchIcon} alt="search" className="w-4 h-4 opacity-40 flex-shrink-0" />
          
          {/* 입력창 */}
          <input
            autoFocus
            className="flex-1 bg-transparent mx-2 outline-none text-body1 text-center placeholder:text-text-gray3"
            placeholder="검색어 입력"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          
          <button 
            onClick={() => { setIsSearching(false); setQuery(""); }}
            className="flex-shrink-0"
          >
            <img src={closeIcon} alt="close" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-text-gray5">
      <div className="flex items-center gap-2">
        <TabButton 
          label="보낸 제안" 
          active={subTab === "sent"} 
          onClick={() => setSubTab("sent")} 
        />
        <button 
          onClick={() => setSubTab("received")}
          className={`px-4 py-2 rounded-lg text-[14px] font-bold flex items-center gap-1 transition-all ${
            subTab === "received" 
              ? "bg-core-1 text-white" 
              : "bg-white border border-text-gray5 text-text-gray3"
          }`}
        >
          받은 제안
          <span className={`flex items-center justify-center rounded-full text-[10px] min-w-[18px] h-[18px] px-1 ${
            subTab === "received" ? "bg-white text-core-1" : "bg-text-gray4 text-white"
          }`}>
            {receivedCount}
          </span>
        </button>

        <TabButton 
          label="지원" 
          active={subTab === "applied"} 
          onClick={() => setSubTab("applied")} 
        />
      </div>
      <button onClick={() => setIsSearching(true)} className="p-1">
        <img src={searchIcon} alt="search" className="w-6 h-6" />
      </button>
    </div>
  );
}