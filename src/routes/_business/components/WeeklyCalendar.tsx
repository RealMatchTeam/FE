const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function WeeklyCalendar() {
  const dates = [6, 7, 8, 9, 10, 11, 12];

  return (
    <div className="flex flex-col gap-3 p-4 bg-white rounded-xl shadow-sm">
      {/* 요일 */}
      <div className="grid grid-cols-7 text-center text-callout2 text-text-gray3">
        {WEEK_DAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* 날짜 */}
      <div className="grid grid-cols-7 gap-y-2 text-center">
        {dates.map((date) => (
          <div
            key={date}
            className={`flex items-center justify-center w-8 h-8 mx-auto rounded-full ${
              date === 11 ? "bg-core-1 text-white" : "text-text-gray2"
            }`}
          >
            {date}
          </div>
        ))}
      </div>

      {/* 일정 */}
      <div className="flex flex-col gap-2">
        <div className="w-3/4 py-1 text-center text-callout2 text-white rounded-full bg-grad-calendar-1">
          비플레인
        </div>
        <div className="w-2/3 py-1 text-center text-callout2 text-white rounded-full bg-grad-calendar-2">
          라운드랩
        </div>
      </div>
    </div>
  );
}
