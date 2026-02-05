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
import LoadingView from "../../../components/common/LoadingView";


export default function CalendarContent() {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState<"collaboration" | "matching">("collaboration");
  const [activeTab, setActiveTab] = useState<"thisMonth" | "today">("thisMonth");
  const [matchingSubTab, setMatchingSubTab] = useState<"sent" | "received">("sent");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("전체");

  const hasData = true;

  // API 데이터 상태
  const [campaigns, setCampaigns] = useState<CampaignCollaboration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // 데이터 로드
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        // 협업 현황 조회를 위해 전체 데이터를 가져옵니다.
        const data = await getMyCollaborations();
        setCampaigns(data);
      } catch (error) {
        console.error("캠페인 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // [필터링 로직]
  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7); // "2026-02"

  const filteredList = campaigns.filter((item) => {
    if (activeTab === "today") {
      return item.startDate <= todayStr && item.endDate >= todayStr;
    }
    // 이번달 기준 (시작일이나 종료일이 이번 달에 포함된 경우)
    return item.startDate.includes(currentMonthStr) || item.endDate.includes(currentMonthStr);
  });

  const handleCardClick = (type: "sent" | "received") => {
    navigate(`/business/proposal?type=${type}`);
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
          /* [A] 협업 현황 */
          <div className="flex flex-col gap-6 px-4 py-6">
            {/* 주간 캘린더 연동 */}
            <section className="flex flex-col gap-3">
              <SectionTitle title="진행 중인 협업" />
              <p className="text-title1 font-bold text-text-black">이번주 일정</p>
              <WeeklyCalendar events={campaigns} />
            </section>
            <section className="flex flex-col gap-3">
              <p className="text-title1 font-bold text-text-black">이번달 일정</p>
              <MonthlyCalendar events={campaigns} />
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
                  <div className="py-10">
                    <LoadingView fullscreen={false} message="일정을 불러오는 중이에요" />
                  </div>
                ) : filteredList.length > 0 ? (
                  filteredList.map((cp) => (
                    <CampaignCard
                      key={cp.campaignId || cp.proposalId}
                      campaignId={cp.campaignId}
                      brand={cp.brandName}
                      title={cp.title}
                      logo={cp.thumbnailUrl}
                      // 날짜 포맷 변경 (2026-02-01 -> 02.01)
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
          /* [B] 매칭 현황 */
          <div className="flex flex-col flex-1">
            <MatchingTabSection subTab={matchingSubTab} setSubTab={setMatchingSubTab} />

            {hasData ? (
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
                  {matchingSubTab === "sent" ? (
                    <>
                      <MatchingCard
                        brand="라운드랩" status="매칭" date="12.23.25" actionLabel="제안 보기"
                        onClick={() => handleCardClick("sent")} // 4. 핸들러 연결
                      />
                      <MatchingCard
                        brand="비플레인" status="검토 중" date="12.23.25" actionLabel="제안 보기"
                        onClick={() => handleCardClick("sent")}
                      />
                      <MatchingCard
                        brand="땡큐파머" status="검토 중" date="12.23.25" actionLabel="제안 보기"
                        onClick={() => handleCardClick("sent")}
                      />
                      <MatchingCard
                        brand="이즈트리" status="거절" date="12.23.25" actionLabel="거절 사유 보기"
                        onClick={() => handleCardClick("sent")}
                      />
                    </>
                  ) : (
                    <>
                      <MatchingCard
                        brand="라운드랩" status="매칭" date="12.23.25" actionLabel="제안 보기"
                        onClick={() => handleCardClick("received")} // 4. 핸들러 연결
                      />
                      <MatchingCard
                        brand="비플레인" status="검토 중" date="12.23.25" actionLabel="제안 보기"
                        onClick={() => handleCardClick("received")}
                      />
                      <MatchingCard
                        brand="그레이스유" status="검토 중" date="12.23.25" actionLabel="제안 보기"
                        onClick={() => handleCardClick("received")}
                      />
                      <MatchingCard
                        brand="이즈트리" status="거절" date="12.23.25" actionLabel="거절 사유 보기"
                        onClick={() => handleCardClick("received")}
                      />
                    </>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center">
                <EmptyState
                  message={`${(matchingSubTab as string) === "sent" ? "보낸" : "받은"} 제안이 없어요`}
                />
              </div>
            )}

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
