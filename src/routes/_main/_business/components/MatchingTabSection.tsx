import { useState } from "react";
import searchIcon from "../../../../assets/search2.svg";
import closeIcon from "../../../../assets/cancel.svg"; 

interface Props {
  subTab: "sent" | "received";
  setSubTab: (tab: "sent" | "received") => void;
}

export default function MatchingTabSection({ subTab, setSubTab }: Props) {
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
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSubTab("sent")}
          className={`text-title2 font-bold ${subTab === "sent" ? "text-core-1" : "text-text-gray3"}`}
        >
          보낸 제안
        </button>
        <button 
          onClick={() => setSubTab("received")}
          className={`text-title2 font-bold flex items-center gap-1 ${subTab === "received" ? "text-core-1" : "text-text-gray3"}`}
        >
          받은 제안
          <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${
            subTab === "received" ? "bg-core-1 text-white" : "bg-text-gray4 text-white"
          }`}>
            2
          </span>
        </button>
      </div>
      <button onClick={() => setIsSearching(true)} className="p-1">
        <img src={searchIcon} alt="search" className="w-6 h-6" />
      </button>
    </div>
  );
}