import type { CampaignCollaboration } from "../calendar/api/calendar";
import { useMemo } from "react";

interface WeeklyCalendarProps {
  events: CampaignCollaboration[]; // 이 부분을 추가하여 props를 정의합니다.
}

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function WeeklyCalendar({ events }: WeeklyCalendarProps) {
  console.log("주간 일정 데이터:", events);

  // 1. 이번 주 날짜 배열 생성 (일~토)
  const weekDates = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 오늘 요일 (0: 일, 1: 월...)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek); // 이번 주 일요일 계산

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];

  // 2. 일정 바 위치 계산 함수
  const getEventStyle = (startDate: string, endDate: string, index: number) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const weekStart = weekDates[0];
    const weekEnd = weekDates[6];

    // 이번 주 범위에 포함되는지 확인
    const displayStart = start < weekStart ? 0 : start.getDay();
    const displayEnd = end > weekEnd ? 6 : end.getDay();
    const duration = displayEnd - displayStart + 1;

    return {
      left: `${(displayStart * 100) / 7}%`,
      width: `${(duration * 100) / 7}%`,
      top: `${index * 26}px`, // 겹치지 않게 위아래 간격 조정
      height: "22px",
      borderRadius: "11px",
    };
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-white rounded-xl shadow-sm relative">
      {/* 요일 */}
      <div className="grid grid-cols-7 text-center text-callout2 text-text-gray3">
        {WEEK_DAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 text-center mb-10">
        {weekDates.map((dateObj) => {
          const dateStr = dateObj.toISOString().split("T")[0];
          const isToday = dateStr === todayStr;
          return (
            <div key={dateStr} className="h-10 flex items-center justify-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-[15px] ${
                  isToday ? "bg-core-1 text-white" : "text-text-black"
                }`}
              >
                {dateObj.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* 일정 바 컨테이너 */}
      <div className="absolute top-[82px] left-4 right-4 pointer-events-none">
        {events.slice(0, 3).map((event, idx) => ( // 최대 3개까지만 노출 예시
          <div
            key={event.campaignId || event.proposalId}
            className={`absolute flex items-center justify-center text-[11px] text-white shadow-sm ${
              idx % 2 === 0 ? "bg-grad-1" : "bg-grad-2"
            }`}
            style={getEventStyle(event.startDate, event.endDate, idx)}
          >
            <span className="truncate px-2">{event.brandName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}