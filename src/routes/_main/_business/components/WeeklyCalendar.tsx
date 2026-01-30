const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function WeeklyCalendar() {
  const dates = [6, 7, 8, 9, 10, 11, 12];

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
        {dates.map((date) => (
          <div key={date} className="h-10 flex items-center justify-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-[15px] ${
                date === 11
                  ? "bg-core-1 text-white"
                  : "text-text-black"
              }`}
            >
              {date}
            </div>
          </div>
        ))}
      </div>

      {/* 일정 바 컨테이너 */}
      <div className="absolute top-[82px] left-4 right-4 pointer-events-none">
        {/* 비플레인 */}
        <div
          className="absolute flex items-center justify-center text-[11px] text-white shadow-sm bg-grad-1"
          style={{
            left: "14.28%", 
            width: "57.14%", 
            height: "22px",
            borderRadius: "11px",
            top: "0px",
          }}
        >
          비플레인
        </div>

        {/* 라운드랩 */}
        <div
          className="absolute flex items-center justify-center text-[11px] text-white shadow-sm bg-grad-2"
          style={{
            left: "42.85%", 
            width: "57.14%",
            height: "22px",
            borderRadius: "11px",
            top: "26px", 
          }}
        >
          라운드랩
        </div>
      </div>
    </div>
  );
}