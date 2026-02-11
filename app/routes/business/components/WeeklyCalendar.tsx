import type { CampaignCollaboration } from "../calendar/api/calendar";
import { useMemo, useState } from "react";
import { format, addDays, startOfWeek, parseISO, differenceInDays, startOfDay } from "date-fns";

interface WeeklyCalendarProps {
  events: CampaignCollaboration[];
}

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function WeeklyCalendar({ events }: WeeklyCalendarProps) {
  const [baseDate, setBaseDate] = useState(new Date());
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  
  const weekStart = startOfWeek(baseDate, { weekStartsOn: 0 });
  const weekEnd = addDays(weekStart, 6);
  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const todayStr = format(new Date(), "yyyy-MM-dd");

  /*const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const todayStr = format(new Date(), "yyyy-MM-dd");*/

  const toggleExpand = (dateStr: string) => {
    setExpandedDates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dateStr)) newSet.delete(dateStr);
      else newSet.add(dateStr);
      return newSet;
    });
  };

  // 1. 이벤트 위치 및 표시 제한 계산
  const positionedEvents = useMemo(() => {
    // 이번 주에 걸쳐 있는 이벤트들
    const filtered = events.filter(event => {
      const start = parseISO(event.startDate);
      const end = parseISO(event.endDate);
      return start <= weekEnd && end >= weekStart;
    });

    // 시안처럼 최대 2개까지만 바(Bar)로 표시
    return filtered.map((event, index) => {
      const start = parseISO(event.startDate);
      const end = parseISO(event.endDate);

      // 이번 주 내 시작/종료 위치
      const displayStart = start < weekStart ? 0 : differenceInDays(startOfDay(start), startOfDay(weekStart));
      const displayEnd = end > weekEnd ? 6 : differenceInDays(startOfDay(end), startOfDay(weekStart));

      return {
        ...event,
        displayStart,
        displayEnd,
        left: `${(displayStart * 100) / 7}%`,
        width: `${((displayEnd - displayStart + 1) * 100) / 7}%`,
        top: `${index * 28}px`, // 바 사이의 간격
        originalIndex: index
      };
    });
  }, [events, weekStart, weekEnd]);

  const currentVisibleMaxIndex = useMemo(() => {
    if (positionedEvents.length === 0) return -1;
    const visibleIndices = positionedEvents.map(event => {
      const isVisible = event.originalIndex < 3 || 
        Array.from({ length: event.displayEnd - event.displayStart + 1 }, (_, i) => 
          format(addDays(weekStart, event.displayStart + i), "yyyy-MM-dd")
        ).some(date => expandedDates.has(date));
      return isVisible ? event.originalIndex : -1;
    });
    return Math.max(0, ...visibleIndices);
  }, [positionedEvents, expandedDates, weekStart]);


  // 스와이프 로직 (기존과 동일)
  // 5. 스와이프 핸들러
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 70) setBaseDate(prev => addDays(prev, 7));  // 다음주
    else if (diff < -70) setBaseDate(prev => addDays(prev, -7)); // 이전주
    setTouchStart(null);
  };

  return (
    <div 
      className="flex flex-col gap-3 p-4 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] select-none overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 text-center text-[13px] text-text-gray3 font-medium">
        {WEEK_DAYS.map((day) => <div key={day}>{day}</div>)}
      </div>

      <div className="grid grid-cols-7 mb-2">
        {weekDates.map((dateObj) => {
          const dateStr = format(dateObj, "yyyy-MM-dd");
          return (
            <div key={dateStr} className="flex justify-center py-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-[15px] font-semibold ${
                dateStr === todayStr ? "bg-[#747BFF] text-white" : "text-[#1E1E1E]"
              }`}>
                {dateObj.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* 스케줄 바 레이어 */}
      {positionedEvents.length > 0 && (
        <div 
          className="relative mx-1 transition-all duration-300 ease-in-out" 
          style={{ height: `${(currentVisibleMaxIndex + 1) * 28}px`, minHeight: '56px' }}
        >
          {positionedEvents.map((event) => {
            const isVisible = event.originalIndex < 3 || 
              Array.from({ length: event.displayEnd - event.displayStart + 1 }, (_, i) => 
                format(addDays(weekStart, event.displayStart + i), "yyyy-MM-dd")
              ).some(date => expandedDates.has(date));

          return (
            <div
              key={event.campaignId + event.startDate}
              className={`absolute h-[24px] bg-gradient-to-l from-[#747BFF] to-[#A2A7FF] text-white text-[10px] flex items-center justify-center rounded-full truncate px-3 font-bold shadow-sm transition-all duration-300 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              }`}
              style={{ 
                left: `calc(${event.left} + 2px)`, 
                width: `calc(${event.width} - 4px)`, 
                top: event.top,
                zIndex: isVisible ? 10 : 0,
                background: 'linear-gradient(90deg, #CBCBF5 0%, #6666E5 50.96%, #CBCBF5 100%)'
              }}
            >
              {event.brandName}
            </div>
          );
        })}
      </div>
      )}



      {/* +N 표시 레이어 */}
      {positionedEvents.length > 0 && (
      <div className={`grid grid-cols-7 pt-1 ${positionedEvents.length > 0 ? 'border-t border-gray-50' : ''}`}>
        {weekDates.map((dateObj) => {
          const dateStr = format(dateObj, "yyyy-MM-dd");
          const dayEvents = events.filter(e => e.startDate <= dateStr && e.endDate >= dateStr);
          const hasMore = dayEvents.length > 3;

          return (
            <div key={`btn-${dateStr}`} className="text-center h-6">
              {hasMore && (
                <button 
                  onClick={() => toggleExpand(dateStr)}
                  className="text-[11px] text-[#747BFF] font-extrabold active:scale-90 transition-transform"
                >
                  {expandedDates.has(dateStr) ? "접기" : `+${dayEvents.length - 3}`}
                </button>
              )}
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}