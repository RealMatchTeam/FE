import { useState, useMemo } from "react";
import type { CampaignCollaboration } from "../calendar/api/calendar";
import { parseISO, startOfDay } from "date-fns";
import ArrowLeftIcon from "../../../assets/icon/arrow-left.svg";
import ArrowRightIcon from "../../../assets/icon/arrow-right.svg";

interface MonthlyCalendarProps {
  events: CampaignCollaboration[];
}

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function MonthlyCalendar({ events }: MonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // MATCHED 상태인 이벤트만 필터링
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
  const getTimestamp = (dateStr: string) => startOfDay(parseISO(dateStr)).getTime();

  // 특정 날짜의 총 이벤트 개수를 구하는 함수 (+N 표시용)
  const getEventsForDate = (day: number) => {
    const targetDate = startOfDay(new Date(year, month - 1, day));
    return matchedEvents.filter(event => {
      const start = startOfDay(parseISO(event.startDate));
      const end = startOfDay(parseISO(event.endDate));
      return targetDate >= start && targetDate <= end;
    });
  };

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
        <div className="grid grid-cols-7 mb-2 text-center text-[13px] text-text-gray3 font-medium">
          {WEEK_DAYS.map(day => <div key={day}>{day}</div>)}
        </div>

        {/* 주차별 렌더링 */}
        {weeks.map((week, weekIdx) => {
          const validDays = week.filter(d => d !== null) as number[];
          const weekStartTs = new Date(year, month - 1, validDays[0]).setHours(0, 0, 0, 0);
          const weekEndTs = new Date(year, month - 1, validDays[validDays.length - 1]).setHours(23, 59, 59, 999);

          const eventsInWeek = matchedEvents.filter(event => {
            const s = getTimestamp(event.startDate);
            const e = getTimestamp(event.endDate);
            return e >= weekStartTs && s <= weekEndTs;
          });

          return (
            <div key={weekIdx} className="grid grid-cols-7 relative border-t border-gray-50 min-h-[90px]">
              {/* 1. 배경 날짜 및 +N 표시 */}
              {week.map((day, dayIdx) => {
                const isToday = day === new Date().getDate() && month === (new Date().getMonth() + 1) && year === new Date().getFullYear();

                // 해당 날짜의 총 이벤트 개수 (+N 표시용)
                const dayEvents = day ? getEventsForDate(day) : [];
                const hasMore = dayEvents.length > 2;

                return (
                  <div key={dayIdx} className="pt-2 flex flex-col items-center relative h-full border-r border-gray-50 last:border-r-0">
                    {day && (
                      <>
                        <span className={`z-10 text-[14px] w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday ? "bg-core-1 text-white font-bold" : "text-text-black"
                          }`}>
                          {day}
                        </span>
                        {/* 3개 이상일 때 +N 표시 */}
                        {hasMore && (
                          <span className="absolute bottom-1 text-[10px] text-core-1 font-bold">
                            +{dayEvents.length - 2}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}

              {/* 2. 이벤트 바 레이어 */}
              <div className="absolute top-10 w-full flex flex-col gap-1 px-0.5">
                {eventsInWeek.slice(0, 2).map((event) => {
                  const sTs = getTimestamp(event.startDate);
                  const eTs = getTimestamp(event.endDate);

                  let startCol = 0;
                  for (let i = 0; i < 7; i++) {
                    if (week[i] !== null) {
                      const currentTs = new Date(year, month - 1, week[i]!).setHours(0, 0, 0, 0);
                      if (currentTs >= sTs) { startCol = i; break; }
                    }
                  }

                  let endCol = 6;
                  for (let i = 6; i >= 0; i--) {
                    if (week[i] !== null) {
                      const currentTs = new Date(year, month - 1, week[i]!).setHours(0, 0, 0, 0);
                      if (currentTs <= eTs) { endCol = i; break; }
                    }
                  }

                  return (
                    <div
                      key={`${event.campaignId}-${weekIdx}`}
                      style={{
                        gridColumnStart: startCol + 1,
                        gridColumnEnd: endCol + 2
                      }}
                      className={`
                        h-[20px] text-[10px] text-white flex items-center justify-center px-2 font-bold z-20
                        ${sTs >= weekStartTs ? "rounded-l-full ml-1" : ""} 
                        ${eTs <= weekEndTs ? "rounded-r-full mr-1" : ""}
                        bg-gradient-to-r from-[#747BFF] to-[#A2A7FF] shadow-sm
                      `}
                    >
                      <span className="truncate">{event.brandName}</span>
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