import { useState, useMemo } from "react";
import type { CampaignCollaboration } from "../calendar/api/calendar";
import ArrowLeftIcon from "../../../assets/icon/arrow-left.svg";
import ArrowRightIcon from "../../../assets/icon/arrow-right.svg";

interface MonthlyCalendarProps {
  events: CampaignCollaboration[];
}

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function MonthlyCalendar({ events }: MonthlyCalendarProps) {
  // 1. 현재 표시할 날짜 상태 (누락되었던 부분 추가)
  const [currentDate, setCurrentDate] = useState(new Date());

  // 2. 해당 월의 정보 계산
  const { year, month, allSlots } = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth(); // 0 ~ 11
    
    const firstDay = new Date(y, m, 1).getDay();
    const lastDate = new Date(y, m + 1, 0).getDate();
    
    const emptyDays = Array(firstDay).fill(null);
    const days = Array.from({ length: lastDate }, (_, i) => i + 1);
    
    return { year: y, month: m + 1, allSlots: [...emptyDays, ...days] };
  }, [currentDate]);

  // 월 이동 핸들러
  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 2, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month, 1));

  // 3. 특정 날짜에 이벤트가 있는지 확인하는 함수
  const getEventsForDay = (day: number | null) => {
    if (!day) return [];
    // YYYY-MM-DD 형식으로 비교
    const targetStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    
    return events.filter(event => {
      return event.startDate <= targetStr && event.endDate >= targetStr;
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4 bg-white rounded-xl shadow-sm">
      {/* 상단 월 이동 */}
      <div className="flex items-center justify-center gap-1">
        <button onClick={handlePrevMonth} type="button" className="p-1 active:opacity-60">
          <img src={ArrowLeftIcon} alt="이전 달" className="w-5 h-5" />
        </button>
        <span className="mx-2 text-[17px] font-bold text-text-black">
          {year}년 {String(month).padStart(2, "0")}월
        </span>
        <button onClick={handleNextMonth} type="button" className="p-1 active:opacity-60">
          <img src={ArrowRightIcon} alt="다음 달" className="w-5 h-5" />
        </button>
      </div>

      <div className="relative">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 mb-4 text-center text-[13px] text-text-gray3">
          {WEEK_DAYS.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 text-center border-t border-gray-50">
          {allSlots.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isToday = day === new Date().getDate() && month === (new Date().getMonth() + 1) && year === new Date().getFullYear();

            return (
              <div key={index} className="h-20 border-b border-gray-50 relative pt-2 flex flex-col items-center">
                {/* 날짜 표시 */}
                <div className="h-7 flex items-center justify-center mb-1">
                  {day && (
                    <span className={`text-[14px] w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday ? "bg-core-1 text-white font-bold" : "text-text-black"
                    }`}>
                      {day}
                    </span>
                  )}
                </div>

                {/* 해당 날짜의 일정 바 (이벤트가 있을 때만 표시) */}
                <div className="w-full px-1 flex flex-col gap-0.5">
                  {dayEvents.slice(0, 2).map((event, idx) => (
                    <div
                      key={event.campaignId || event.proposalId}
                      className={`h-3 w-full rounded-sm text-[8px] text-white truncate px-1 ${
                        idx % 2 === 0 ? "bg-grad-1" : "bg-grad-2"
                      }`}
                    >
                      {event.brandName}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <span className="text-[8px] text-text-gray3">+{dayEvents.length - 2}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}