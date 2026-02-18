import { useState } from "react";
import searchIcon from "../../../assets/search2.svg";
import closeIcon from "../../../assets/cancel.svg"; 

interface Props {
  subTab: "sent" | "received" | "applied";
  setSubTab: (tab: "sent" | "received" | "applied") => void;
  receivedCount?: number; 
  keyword: string; 
  setKeyword: (keyword: string) => void;
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-[10px] py-2 rounded-[8px] text-[14px] leading-[20px] font-semibold transition-all ${
        active 
          ? "bg-core-1 text-white" 
          : "bg-white border border-text-gray5 text-text-gray3"
      }`}
    >
      {label}
    </button>
  );
}

export default function MatchingTabSection({ subTab, setSubTab, receivedCount, keyword, setKeyword }: Props) {
  const [isSearching, setIsSearching] = useState(false);

  if (isSearching) {
    return (
      <div className="flex flex-col w-full animate-slide-up border-b border-text-gray5"> 
        <div className="flex items-center w-full px-4 py-3">
          <div className="flex items-center w-full relative bg-bg-w border border-core-2 rounded-[8px] px-3 py-2">
            <img src={searchIcon} alt="search" className="w-4 h-4 opacity-40 flex-shrink-0" />
            <input
              autoFocus
              className="flex-1 bg-transparent mx-2 outline-none text-body1 text-center placeholder:text-text-gray3"
              placeholder="브랜드명 입력"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)} // 부모의 setKeyword 호출
            />
            <button
              onClick={() => { setIsSearching(false); setKeyword(""); }}
              className="flex-shrink-0"
            >
              <img src={closeIcon} alt="close" />
            </button>
          </div>
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
          className={`px-4 py-2 rounded-lg text-[14px] font-semibold flex items-center gap-1 transition-all ${
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
      <button 
        onClick={() => setIsSearching(true)} 
        className="w-[40px] h-[36px] flex items-center justify-center bg-white border border-text-gray5 rounded-[8px] active:bg-bluegray-2 transition-colors"
      >
        <img src={searchIcon} alt="search" className="w-5 h-5 opacity-40" />
      </button>
    </div>
  );
}
