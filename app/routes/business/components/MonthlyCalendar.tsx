import { useState, useMemo } from "react";
import type { CampaignCollaboration } from "../calendar/api/calendar";
import ArrowLeftIcon from "../../../assets/icon/arrow-left.svg";
import ArrowRightIcon from "../../../assets/icon/arrow-right.svg";

interface MonthlyCalendarProps {
  events: CampaignCollaboration[];
}

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function MonthlyCalendar({ events }: MonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 1. MATCHED 상태인 이벤트만 필터링
  const matchedEvents = useMemo(() =>
    events.filter(event => event.status === "MATCHED"),
    [events]
  );

  const { year, month, weeks } = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const firstDayOfMonth = new Date(y, m, 1).getDay();
    const lastDateOfMonth = new Date(y, m + 1, 0).getDate();

    const weeksArr: (number | null)[][] = [];
    let currentWeek: (number | null)[] = Array(firstDayOfMonth).fill(null);

    for (let i = 1; i <= lastDateOfMonth; i++) {
      currentWeek.push(i);
      if (currentWeek.length === 7) {
        weeksArr.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      weeksArr.push(currentWeek);
    }

    return { year: y, month: m + 1, weeks: weeksArr };
  }, [currentDate]);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 2, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month, 1));

  // 날짜 문자열 비교를 위한 헬퍼 함수
  const getTime = (dateStr: string) => new Date(dateStr).setHours(0, 0, 0, 0);

  return (
    <div className="flex flex-col gap-6 p-4 bg-white rounded-xl shadow-sm overflow-hidden">
      {/* 상단 컨트롤 */}
      <div className="flex items-center justify-center gap-1">
        <button onClick={handlePrevMonth} className="p-1"><img src={ArrowLeftIcon} alt="이전달" /></button>
        <span className="mx-2 text-[17px] font-bold">{year}년 {String(month).padStart(2, "0")}월</span>
        <button onClick={handleNextMonth} className="p-1"><img src={ArrowRightIcon} alt="다음달" /></button>
      </div>

      <div className="flex flex-col">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 mb-2 text-center text-[13px] text-text-gray3">
          {WEEK_DAYS.map(day => <div key={day}>{day}</div>)}
        </div>

        {/* 주차별 렌더링 */}
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 relative border-t border-gray-50 min-h-[85px]">
            {/* 배경 날짜 숫자 */}
            {week.map((day, dayIdx) => {
              const isToday = day === new Date().getDate() && month === (new Date().getMonth() + 1) && year === new Date().getFullYear();
              return (
                <div key={dayIdx} className="pt-2 flex flex-col items-center">
                  {day && (
                    <span className={`text-[14px] w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-core-1 text-white font-bold" : "text-text-black"}`}>
                      {day}
                    </span>
                  )}
                </div>
              );
            })}

            {/* 이벤트 바 레이어 */}
            <div className="absolute top-10 w-full flex flex-col gap-1.5 px-1">
              {matchedEvents.map((event, eventIdx) => {
                const weekDates = week.filter((d) => d !== null) as number[];
                if (weekDates.length === 0) return null;

                const weekStart = new Date(year, month - 1, weekDates[0]).setHours(0, 0, 0, 0);
                const weekEnd = new Date(year, month - 1, weekDates[weekDates.length - 1]).setHours(23, 59, 59, 999);
                const eventStart = getTime(event.startDate);
                const eventEnd = getTime(event.endDate);

                if (eventEnd < weekStart || eventStart > weekEnd) return null;

                const startIdx = week.findIndex((d) => d !== null && getTime(`${year}-${month}-${d}`) >= eventStart);
                const actualStartIdx = startIdx === -1 ? 0 : startIdx;

                const reversedIdx = [...week].reverse().findIndex((d) => d !== null && getTime(`${year}-${month}-${d}`) <= eventEnd);
                const endIdx = reversedIdx === -1 ? -1 : week.length - 1 - reversedIdx;
                const actualEndIdx = endIdx === -1 ? 6 : endIdx;

                const colStart = actualStartIdx + 1;
                const colSpan = actualEndIdx - actualStartIdx + 1;
                
                const isRealStart = eventStart >= weekStart && eventStart <= weekEnd;
                const isRealEnd = eventEnd >= weekStart && eventEnd <= weekEnd;

                return (
                  <div
                    key={`${event.campaignId || event.proposalId}-${weekIdx}`}
                    style={{ gridColumn: `${colStart} / span ${colSpan}` }}
                    className={`
          h-6 text-[11px] text-white flex items-center justify-center px-2 transition-all
          ${isRealStart ? "rounded-l-full" : ""} 
          ${isRealEnd ? "rounded-r-full" : ""}
          ${eventIdx % 2 === 0
                        ? "bg-gradient-to-r from-[#BFC8F5] to-[#6366F1]" 
                        : "bg-gradient-to-r from-[#D8B4FE] to-[#818CF8]"
                      }
        `}
                  >
                    <span className="truncate font-bold tracking-tight">
                      {event.brandName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}