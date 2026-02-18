import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getMyCollaborations, searchCollaborations } from "./api/calendar";
import type { CampaignCollaboration, } from "./api/calendar";
import FilterBottomSheet from "../components/FilterBottomSheet";
import WeeklyCalendar from "../components/WeeklyCalendar";
import MonthlyCalendar from "../components/MonthlyCalendar";
import CampaignCard from "../components/CampaignCard";
import SectionTitle from "../components/SectionTitle";
import MatchingCard from "../components/MatchingCard";
import MatchingTabSection from "../components/MatchingTabSection";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import Tabs from "../../../components/common/Tabs";

export default function CalendarContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mainTab, setMainTab] = useState<"collaboration" | "matching">("collaboration");
  const [activeTab, setActiveTab] = useState<"thisMonth" | "today">("thisMonth");
  const [matchingSubTab, setMatchingSubTab] = useState<"sent" | "received" | "applied">("sent");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("전체");

  const [keyword, setKeyword] = useState("");

  const [campaigns, setCampaigns] = useState<CampaignCollaboration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isFiltered = activeFilter !== "전체";

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);

        // 1. 키워드가 있을 때는 searchCollaborations API 사용
        // 2. 키워드가 없을 때는 getMyCollaborations API 사용

        const fetchFunction = keyword.trim() ? searchCollaborations : getMyCollaborations;

        const [applied, sent, received] = await Promise.all([
          fetchFunction({ type: "APPLIED", keyword: keyword.trim() || undefined }),
          fetchFunction({ type: "SENT", keyword: keyword.trim() || undefined }),
          fetchFunction({ type: "RECEIVED", keyword: keyword.trim() || undefined }),
        ]);

        setCampaigns([...applied, ...sent, ...received]);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        setCampaigns([]); // 에러 시 빈 배열 처리
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, [keyword, location.key]);

  // 날짜 계산을 별도 useMemo로 분리
  const dateInfo = useMemo(() => {
    const today = new Date();
    const todayStr = today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');
    const currentMonthStr = todayStr.substring(0, 7);

    return { todayStr, currentMonthStr };
  }, []);

  const filteredList = useMemo(() => {
    const { todayStr, currentMonthStr } = dateInfo;

    return campaigns.filter((item) => {
      if (item.status !== "MATCHED") return false;

      if (activeTab === "today") {
        return item.startDate <= todayStr && item.endDate >= todayStr;
      } else {
        const startMonth = item.startDate.substring(0, 7);
        const endMonth = item.endDate.substring(0, 7);
        return startMonth <= currentMonthStr && endMonth >= currentMonthStr;
      }
    });
  }, [campaigns, activeTab, dateInfo]);

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

  // CalendarContent.tsx 내부 matchingList

  const matchingList = useMemo(() => {
    return campaigns.filter((item) => {
      // 탭 필터링
      const isCorrectSubTab =
        matchingSubTab === "sent" ? item.type === "SENT" :
          matchingSubTab === "received" ? item.type === "RECEIVED" :
            item.type === "APPLIED";

      if (!isCorrectSubTab) return false;

      // 상태 필터링 (activeFilter가 "전체"가 아닐 때만 적용)
      if (activeFilter !== "전체") {
        return getStatusLabel(item.status) === activeFilter;
      }

      return true;
    });
  }, [campaigns, matchingSubTab, activeFilter]); // keyword는 이제 API 결과(campaigns)에 반영되어 있으므로 제외 가능

  console.log("전체 데이터:", campaigns);
  console.log("필터된 데이터:", matchingList);

  const calendarEvents = campaigns.filter(item => item.status === "MATCHED");

  const handleCardClick = (item: CampaignCollaboration) => {
    const proposalId = item.proposalId || item.campaignId;
    const navigationState = { state: { brandId: item.brandId } };

    if (item.status === "REJECTED") {
      navigate(`/business/rejection?proposalId=${proposalId}`, navigationState);
      return;
    }

    if (item.type === "APPLIED") {
      navigate(`/business/proposal?type=applied&applicationId=${proposalId}`, navigationState);
      return;
    }

    if (item.type === "RECEIVED") {
      navigate(`/business/proposal?type=received&proposalId=${proposalId}`, navigationState);
      return;
    }

    navigate(`/business/proposal?type=sent&proposalId=${proposalId}`, navigationState);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-bluegray-1">
      <Tabs
        tabs={[
          { label: "협업 현황", value: "collaboration" },
          { label: "매칭 현황", value: "matching" },
        ]}
        activeTab={mainTab}
        onTabChange={(value) => setMainTab(value as "collaboration" | "matching")}
      />

      <main className="flex flex-col flex-1">
        {mainTab === "collaboration" ? (
          /* 협업 현황 */
          <div className="flex flex-col gap-6 px-4 py-6">
            {/* 주간 캘린더 연동 */}
            <section className="flex flex-col gap-3">
              <SectionTitle title="진행 중인 협업" />
              <p className="text-title1 font-semibold text-text-black">이번주 일정</p>
              <WeeklyCalendar events={calendarEvents} />
            </section>
            <section className="flex flex-col gap-3">
              <p className="text-title1 font-semibold text-text-black">이번달 일정</p>
              <MonthlyCalendar events={calendarEvents} />
            </section>

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
                  <LoadingSpinner className="py-10" />
                ) : filteredList.length > 0 ? (
                  filteredList.map((cp) => (
                    <CampaignCard
                      key={`${cp.campaignId}-${cp.proposalId}-${cp.status}`}
                      campaignId={cp.campaignId}
                      proposalId={cp.proposalId ?? undefined}
                      brandId={cp.brandId}
                      category={cp.category || "beauty"}
                      type={cp.type}
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
              keyword={keyword}
              setKeyword={setKeyword}
            />

            <div className="flex flex-col gap-4 px-4 flex-1">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-title1 font-semibold text-text-black">매칭 현황</h2>
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className={`flex items-center w-fit h-7 pl-3 pr-1.5 rounded-full border text-[14px] font-medium text-[#5B5D6B] ${isFiltered
                      ? "border-core-70 text-core-1 bg-core-70"
                      : "border-core-2 text-gray-2 bg-white"
                    }`}
                >
                  {activeFilter}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="none"
                    className={`w-6 h-6 ${isFiltered ? "text-core-1" : "text-text-gray2"
                      }`}
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

              <div className="flex flex-col gap-4">
                {isLoading ? (
                  <LoadingSpinner className="py-6" size={80} />
                ) : matchingList.length > 0 ? (
                  matchingList.map((item) => (
                    <MatchingCard
                      key={item.proposalId || `campaign-${item.campaignId}`}
                      brand={item.brandName}
                      status={getStatusLabel(item.status)}
                      date={item.startDate.split('-').slice(1).join('.') + "." + item.startDate.split('-')[0].slice(2)}
                      actionLabel={
                        item.status === "REJECTED"
                          ? "거절 사유 보기"
                          : item.type === "APPLIED"
                            ? "지원 보기"
                            : "제안 보기"
                      }
                      logo={item.thumbnailUrl}
                      brandId={item.brandId}
                      brandUserId={item.brandUserId}
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
