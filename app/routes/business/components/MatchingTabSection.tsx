import { useState, useEffect, useCallback } from "react";
import { searchCollaborations, type CampaignCollaboration } from "../calendar/api/calendar"; 
import searchIcon from "../../../assets/search2.svg";
import closeIcon from "../../../assets/cancel.svg"; 
import LoadingSpinner from "../../../components/common/LoadingSpinner";

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
  const [campaigns, setCampaigns] = useState<CampaignCollaboration[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 캠페인 검색 함수
  const fetchCampaigns = useCallback(async () => {
    if (!keyword.trim()) return;
    setIsLoading(true);
    try {
      const data = await searchCollaborations({
        keyword: keyword.trim(),
        type: subTab.toUpperCase() as "APPLIED" | "SENT" | "RECEIVED",
      });
      setCampaigns(data || []);
    } catch (error) {
      console.error("검색 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [keyword, subTab]);

  // 검색 상태에 따라 캠페인 검색
  useEffect(() => {
    if (isSearching && keyword.trim()) {
      fetchCampaigns();
    } else {
      setCampaigns([]);
    }
  }, [isSearching, keyword, subTab, fetchCampaigns]);

  if (isSearching) {
    return (
      <div className="flex flex-col w-full animate-slide-up"> 
        {/* 검색바 섹션 */}
        <div className="flex items-center w-full px-4 py-3">
          <div className="flex items-center w-full relative bg-bg-w border border-core-2 rounded-[8px] px-3 py-2">
            <img src={searchIcon} alt="search" className="w-4 h-4 opacity-40 flex-shrink-0" />
            <input
              autoFocus
              className="flex-1 bg-transparent mx-2 outline-none text-body1 text-center placeholder:text-text-gray3"
              placeholder="브랜드명 입력"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              onClick={() => { setIsSearching(false); setKeyword(""); }}
              className="flex-shrink-0"
            >
              <img src={closeIcon} alt="close" />
            </button>
          </div>
        </div>

        {/* 로딩 표시 */}
        {isLoading && <LoadingSpinner className="py-4" size={80} />}

        {/* 검색 결과 리스트 */}
        <div className="px-4 overflow-y-auto">
          {!isLoading && campaigns.length > 0 ? (
            campaigns.map((item) => (
              <div key={item.campaignId} className="py-3 border-b border-text-gray5 text-[14px]">
                {item.brandName} - {item.title} {/* 브랜드명과 제목 표시 */}
              </div>
            ))
          ) : (
            !isLoading && keyword && <div className="text-center py-10 text-text-gray4">검색 결과가 없습니다.</div>
          )}
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
