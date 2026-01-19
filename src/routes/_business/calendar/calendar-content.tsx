import { useState } from "react";

import Header from "../../../components/layout/Header";
import WeeklyCalendar from "../components/WeeklyCalendar";
import MonthlyCalendar from "../components/MonthlyCalendar";
import CampaignCard from "../components/CampaignCard";
import SectionTitle from "../components/SectionTitle";

export default function CalendarContent() {
    const [mainTab, setMainTab] = useState<'collaboration' | 'matching'>('collaboration');
    const [activeTab, setActiveTab] = useState<'thisMonth' | 'today'>('thisMonth');

    return (
        <div className="flex flex-col w-full min-h-screen bg-bluegray-1">
            <Header title="Real Match" />

            {/* 1. 상단 협업/매칭 현황 탭 */}
            <div className="flex w-full bg-white border-b border-gray-100">
                <button
                    onClick={() => setMainTab('collaboration')}
                    className="flex-1 py-4 text-[16px] font-bold relative transition-colors"
                    style={{ color: mainTab === 'collaboration' ? '#6666E5' : '#9B9BA1' }}
                >
                    협업 현황
                    {mainTab === 'collaboration' && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120px] h-[2px] bg-[#6666E5]" />
                    )}
                </button>
                <button
                    onClick={() => setMainTab('matching')}
                    className="flex-1 py-4 text-[16px] font-bold relative transition-colors"
                    style={{ color: mainTab === 'matching' ? '#6666E5' : '#9B9BA1' }}
                >
                    매칭 현황
                    {mainTab === 'matching' && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120px] h-[2px] bg-[#6666E5]" />
                    )}
                </button>
            </div>

            <main className="flex flex-col gap-6 px-4 py-6">
                {/* 진행 중인 협업 섹션 */}
                <section className="flex flex-col gap-3">
                    <SectionTitle title="진행 중인 협업" />
                    <p className="text-title1 text-text-black font-bold">이번주 일정</p>
                    <WeeklyCalendar />
                </section>

                {/* 이번달 일정 섹션 */}
                <section className="flex flex-col gap-3">
                    <p className="text-title1 text-text-black font-bold">이번달 일정</p>
                    <MonthlyCalendar />
                </section>

                {/* 협업 리스트 섹션 */}
                <section className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveTab('thisMonth')}
                            className="text-[14px] font-semibold"
                            style={{ color: activeTab === 'thisMonth' ? '#6666E5' : '#9B9BA1' }}
                        >
                            이번달
                        </button>
                        <span className="text-[14px] text-[#9B9BA1]">|</span>
                        <button
                            onClick={() => setActiveTab('today')}
                            className="text-[14px] font-semibold"
                            style={{ color: activeTab === 'today' ? '#6666E5' : '#9B9BA1' }}
                        >
                            오늘
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <CampaignCard brand="비플레인" title="비플레인 클렌징 및 세럼 리뷰" startDate="12.21" endDate="12.24" />
                        <CampaignCard brand="비플레인" title="비플레인 클렌징 및 세럼 리뷰" startDate="12.23" endDate="12.26" />
                        <CampaignCard brand="비플레인" title="비플레인 클렌징 및 세럼 리뷰" startDate="01.10" endDate="01.15" />
                    </div>
                </section>
            </main>
        </div>
    );
}
