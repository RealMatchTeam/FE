import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyCollaborations } from "./api/calendar";
import type { CampaignCollaboration } from "./api/calendar";
import FilterBottomSheet from "../components/FilterBottomSheet";
import WeeklyCalendar from "../components/WeeklyCalendar";
import MonthlyCalendar from "../components/MonthlyCalendar";
import CampaignCard from "../components/CampaignCard";
import SectionTitle from "../components/SectionTitle";
import MatchingCard from "../components/MatchingCard";
import MatchingTabSection from "../components/MatchingTabSection";
import dropdownIcon from "../../../assets/arrow-down.svg";
import EmptyState from "../components/EmptyState";
//import { MATCHING_DUMMY_DATA } from "../calendar/api/calendar";

export default function CalendarContent() {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState<"collaboration" | "matching">("collaboration");
  const [activeTab, setActiveTab] = useState<"thisMonth" | "today">("thisMonth");
  const [matchingSubTab, setMatchingSubTab] = useState<"sent" | "received" | "applied">("sent");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("전체");

  const [campaigns, setCampaigns] = useState<CampaignCollaboration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        const data = await getMyCollaborations({
          type: matchingSubTab.toUpperCase() as "APPLIED" | "SENT" | "RECEIVED"
        });
        setCampaigns(data || []);
      } catch (error) {
        console.error("로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaigns();
  }, [matchingSubTab]);

  // 상태 변환 헬퍼 함수
  const getStatusLabel = (status: CampaignCollaboration["status"]): "매칭" | "검토 중" | "거절" => {
    switch (status) {
      case "MATCHED":
        return "매칭";
      case "REVIEWING":
      case "NONE": 
        return "검토 중";
      case "REJECTED":
        return "거절";
      default:
        return "검토 중";
    }
  };

  const matchingList = campaigns.filter((item) => {
    const isCorrectSubTab =
      matchingSubTab === "sent" ? item.type === "SENT" :
        matchingSubTab === "received" ? item.type === "RECEIVED" :
          item.type === "APPLIED";

    if (!isCorrectSubTab) return false;

    if (activeFilter === "전체") return true;
    return getStatusLabel(item.status) === activeFilter;
  });

  console.log("전체 데이터:", campaigns);
  console.log("필터된 데이터:", matchingList);

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7);
  const calendarEvents = campaigns.filter(item => item.status === "MATCHED");

  const filteredList = campaigns.filter((item) => {
    if (activeTab === "today") {
      return item.startDate <= todayStr && item.endDate >= todayStr;
    }
    return item.startDate.includes(currentMonthStr) || item.endDate.includes(currentMonthStr);
  });

  const handleCardClick = (item: CampaignCollaboration) => {
  const proposalId = item.proposalId || item.campaignId;

  // 1. 거절 상태일 때
  if (item.status === "REJECTED") {
    navigate(`/rejection?proposalId=${proposalId}`);
    return;
  }

  // 2. 지원 현황 탭에서 온 경우 (내가 지원한 캠페인)
  if (item.type === "APPLIED") {
    navigate(`/business/proposal?type=applied&applicationId=${proposalId}`);
    return;
  }

  // 3. 받은 제안 탭에서 온 경우 (브랜드가 나에게 제안)
  if (item.type === "RECEIVED") {
    navigate(`/business/proposal?type=received&proposalId=${proposalId}`);
    return;
  }

  // 4. 보낸 제안 (기본값)
  navigate(`/business/proposal?type=sent&proposalId=${proposalId}`);
};

  return (
    <div className="flex flex-col w-full min-h-screen bg-bluegray-1">
      {/* 탭 네비게이션 */}
      <div className="flex w-full bg-bg-w border-b border-text-gray5">
        <button
          onClick={() => setMainTab("collaboration")}
          className={`flex-1 py-4 text-[16px] font-bold relative transition-colors ${mainTab === "collaboration" ? "text-core-1" : "text-text-gray3"
            }`}
        >
          협업 현황
          {mainTab === "collaboration" && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120px] h-[2px] bg-core-1" />
          )}
        </button>
        <button
          onClick={() => setMainTab("matching")}
          className={`flex-1 py-4 text-[16px] font-bold relative transition-colors ${mainTab === "matching" ? "text-core-1" : "text-text-gray3"
            }`}
        >
          매칭 현황
          {mainTab === "matching" && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120px] h-[2px] bg-core-1" />
          )}
        </button>
      </div>

      <main className="flex flex-col flex-1">
        {mainTab === "collaboration" ? (
          /* 협업 현황 */
          <div className="flex flex-col gap-6 px-4 py-6">
            {/* 주간 캘린더 연동 */}
            <section className="flex flex-col gap-3">
              <SectionTitle title="진행 중인 협업" />
              <p className="text-title1 font-bold text-text-black">이번주 일정</p>
              <WeeklyCalendar events={calendarEvents} />
            </section>
            <section className="flex flex-col gap-3">
              <p className="text-title1 font-bold text-text-black">이번달 일정</p>
              <MonthlyCalendar events={calendarEvents} />
            </section>

            {/* 하단 리스트 섹션 */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("thisMonth")}
                  className={`text-[14px] font-semibold ${activeTab === "thisMonth" ? "text-core-1" : "text-text-gray3"}`}
                >
                  이번달
                </button>
                <span className="text-[14px] text-text-gray3">|</span>
                <button
                  onClick={() => setActiveTab("today")}
                  className={`text-[14px] font-semibold ${activeTab === "today" ? "text-core-1" : "text-text-gray3"}`}
                >
                  오늘
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {isLoading ? (
                  <p className="text-center py-10 text-text-gray3">로딩 중...</p>
                ) : filteredList.length > 0 ? (
                  filteredList.map((cp) => (
                    <CampaignCard
                      key={cp.campaignId || cp.proposalId}
                      campaignId={cp.campaignId}
                      brand={cp.brandName}
                      title={cp.title}
                      logo={cp.thumbnailUrl}

                      startDate={cp.startDate.split('-').slice(1).join('.')}
                      endDate={cp.endDate.split('-').slice(1).join('.')}
                    />
                  ))
                ) : (
                  <div className="py-10">
                    <EmptyState message="해당하는 캠페인 일정이 없어요" />
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          /* 매칭 현황 */
          <div className="flex flex-col flex-1">
            <MatchingTabSection
              subTab={matchingSubTab}
              setSubTab={setMatchingSubTab}

              receivedCount={campaigns.filter(c => c.type === "RECEIVED").length}
            />

            <div className="flex flex-col gap-4 px-4 flex-1">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-title1 font-bold text-text-black">매칭 현황</h2>
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="flex items-center gap-1 px-3 py-1 border border-text-gray4 rounded-full bg-white active:bg-bluegray-2 transition-colors"
                >
                  <span className="text-callout1 text-text-gray2">{activeFilter}</span>
                  <img src={dropdownIcon} alt="open filter" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {isLoading ? (
                  <p>로딩 중...</p>
                ) : matchingList.length > 0 ? (
                  matchingList.map((item) => (
                    <MatchingCard
                      key={item.campaignId || item.proposalId}
                      brand={item.brandName}
                      status={getStatusLabel(item.status)}
                      date={item.startDate.split('-').slice(1).join('.') + "." + item.startDate.split('-')[0].slice(2)}
                      actionLabel={item.status === "REJECTED" ? "거절 사유 보기" : "제안 보기"}
                      onClick={() => handleCardClick(item)}
                    />
                  ))
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-20">
                    <EmptyState
                      message={`${matchingSubTab === "sent" ? "보낸" : "받은"} 제안이 없어요`}
                    />
                  </div>
                )}
              </div>
            </div>

            <FilterBottomSheet
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApply={(filter) => setActiveFilter(filter)}
              currentFilter={activeFilter}
            />
          </div>
        )}
      </main>
    </div>
  );
}
