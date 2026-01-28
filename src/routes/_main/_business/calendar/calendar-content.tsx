import { useState } from "react";

import FilterBottomSheet from "../components/FilterBottomSheet";
import WeeklyCalendar from "../components/WeeklyCalendar";
import MonthlyCalendar from "../components/MonthlyCalendar";
import CampaignCard from "../components/CampaignCard";
import SectionTitle from "../components/SectionTitle";
import MatchingCard from "../components/MatchingCard";
import MatchingTabSection from "../components/MatchingTabSection";
import dropdownIcon from "../../../../assets/arrow-down.svg";
import EmptyState from "../components/EmptyState";

export default function CalendarContent() {
  const [mainTab, setMainTab] = useState<"collaboration" | "matching">("collaboration");
  const [activeTab, setActiveTab] = useState<"thisMonth" | "today">("thisMonth");
  const [matchingSubTab, setMatchingSubTab] = useState<"sent" | "received">("sent");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("전체");

  const hasData = matchingSubTab === "sent";

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
            <section className="flex flex-col gap-3">
              <SectionTitle title="진행 중인 협업" />
              <p className="text-title1 font-bold text-text-black">이번주 일정</p>
              <WeeklyCalendar />
            </section>
            <section className="flex flex-col gap-3">
              <p className="text-title1 font-bold text-text-black">이번달 일정</p>
              <MonthlyCalendar />
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
                <CampaignCard brand="비플레인" title="비플레인 클렌징 및 세럼 리뷰" startDate="12.21" endDate="12.24" />
                <CampaignCard brand="비플레인" title="비플레인 클렌징 및 세럼 리뷰" startDate="12.23" endDate="12.26" />
              </div>
            </section>
          </div>
        ) : (
          /* [B] 매칭 현황 */
          <div className="flex flex-col flex-1">
            <MatchingTabSection subTab={matchingSubTab} setSubTab={setMatchingSubTab} />

            {hasData ? (
              <div className="flex flex-col gap-4 px-4 py-6 flex-1">
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
                  <MatchingCard brand="라운드랩" status="매칭" date="12.23.25" actionLabel="제안 보기" />
                  <MatchingCard brand="비플레인" status="검토 중" date="12.23.25" actionLabel="제안 보기" />
                  <MatchingCard brand="땡큐파머" status="검토 중" date="12.23.25" actionLabel="제안 보기" />
                  <MatchingCard brand="이즈트리" status="거절" date="12.23.25" actionLabel="거절 사유 보기" />
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
