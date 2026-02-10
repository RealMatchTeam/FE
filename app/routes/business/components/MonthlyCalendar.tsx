import { useState, useMemo } from "react";
import type { CampaignCollaboration } from "../calendar/api/calendar";
import { parseISO, startOfDay } from "date-fns";
import ArrowLeftIcon from "../../../assets/icon/arrow-left.svg";
import ArrowRightIcon from "../../../assets/icon/arrow-right.svg";

import { isMatched, isDateInCampaignRange, isEventInCurrentMonth } from "../../../utils/calendar";

interface MonthlyCalendarProps {
  events: CampaignCollaboration[];
}

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function MonthlyCalendar({ events }: MonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 10));

  const matchedEvents = useMemo(() =>
    events.filter(event =>
      isMatched(event.status) &&
      isEventInCurrentMonth(event.startDate, event.endDate, currentDate)
    ),
    [events, currentDate]
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

  const getTimestamp = (dateStr: string) => startOfDay(parseISO(dateStr)).getTime();

  const getEventsForDate = (day: number) => {
    const targetDate = new Date(year, month - 1, day);
    return matchedEvents.filter(event =>
      isDateInCampaignRange(event.startDate, event.endDate, targetDate)
    );
  };

  return (
    <div className="flex flex-col gap-6 p-4 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      {/* 상단 컨트롤 */}
      <div className="flex items-center justify-center gap-1">
        <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-50 rounded-full transition-colors">
          <img src={ArrowLeftIcon} alt="이전달" />
        </button>
        <span className="mx-2 text-[17px] font-bold text-text-black">{year}년 {String(month).padStart(2, "0")}월</span>
        <button onClick={handleNextMonth} className="p-1 hover:bg-gray-50 rounded-full transition-colors">
          <img src={ArrowRightIcon} alt="다음달" />
        </button>
      </div>

      <div className="flex flex-col">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 mb-4 text-center text-[13px] font-bold">
          {WEEK_DAYS.map((day, i) => (
            <div key={day} className={i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-text-gray3"}>
              {day}
            </div>
          ))}
          
        </div>

        {/* 주차별 렌더링 */}
        {weeks.map((week, weekIdx) => {
          const firstValidDay = week.find(d => d !== null)!;
          const lastValidDay = [...week].reverse().find(d => d !== null)!;
          const weekStartTs = new Date(year, month - 1, firstValidDay).setHours(0, 0, 0, 0);
          const weekEndTs = new Date(year, month - 1, lastValidDay).setHours(23, 59, 59, 999);

          const eventsInWeek = matchedEvents.filter(event => {
            const s = getTimestamp(event.startDate);
            const e = getTimestamp(event.endDate);
            return e >= weekStartTs && s <= weekEndTs;
          });

          return (
            <div key={weekIdx} className="grid grid-cols-7 relative border-t border-gray-100 min-h-[100px]">
              {/* 1. 날짜 숫자 및 배경 그리드 */}
              {week.map((day, dayIdx) => {
                const isToday = day === new Date().getDate() && month === (new Date().getMonth() + 1) && year === new Date().getFullYear();
                const dayEvents = day ? getEventsForDate(day) : [];
                const extraCount = dayEvents.length - 2;

                return (
                  <div key={dayIdx} className="pt-2 pb-1 flex flex-col items-center relative h-full border-r border-gray-50 last:border-r-0">
                    {day && (
                      <span className={`z-10 text-[12px] font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-core-1 text-white" : "text-text-black"}`}>
                        {day}
                      </span>
                    )}
                    {/* +N 표시: 이벤트 바 아래쪽에 배치 */}
                    {day && extraCount > 0 && (
                      <span className="absolute bottom-1 text-[10px] text-core-1 font-extrabold z-30">
                        +{extraCount}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* 이벤트 바 레이어 - flex 제거 */}
              <div className="absolute top-8 w-full grid grid-cols-7 gap-1">
                {eventsInWeek.map((event) => {
                  const sTs = new Date(event.startDate).setHours(0, 0, 0, 0);
                  const eTs = new Date(event.endDate).setHours(0, 0, 0, 0);

                  let startCol = -1;
                  let endCol = -1;

                  week.forEach((day, i) => {
                    if (day === null) return;
                    const currentDayTs = new Date(year, month - 1, day).setHours(0, 0, 0, 0);

                    if (currentDayTs >= sTs && currentDayTs <= eTs) {
                      if (startCol === -1) startCol = i;
                      endCol = i;
                    }
                  });

                  if (startCol === -1 || endCol === -1) return null;

                  return (
                    <div
                      key={`${event.campaignId}-${weekIdx}`}
                      style={{
                        gridColumnStart: startCol + 1,
                        gridColumnEnd: endCol + 2 // 종료일 포함
                      }}
                      className={`
                        h-[18px] text-[10px] text-white flex items-center px-2 font-bold z-20 overflow-hidden
                        bg-gradient-to-r from-[#747BFF] to-[#A2A7FF]
                      `}
                    >
                      <span className="truncate whitespace-nowrap">{event.brandName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}