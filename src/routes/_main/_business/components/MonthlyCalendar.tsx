import ArrowLeftIcon from "../../../../assets/arrow-left.svg";
import ArrowRightIcon from "../../../../assets/arrow-right.svg";

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function MonthlyCalendar() {
  const emptyDays = Array(2).fill(null);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const allSlots = [...emptyDays, ...days];

  return (
    <div className="flex flex-col gap-6 p-4 bg-white rounded-xl shadow-sm">
      {/* 상단 월 이동 */}
      <div className="flex items-center justify-center gap-1">
        <button type="button" className="p-1 active:opacity-60">
          <img src={ArrowLeftIcon} alt="이전 달" className="w-5 h-5" />
        </button>
        <span className="mx-2 text-[17px] font-bold text-text-black">
          2025년 07월
        </span>
        <button type="button" className="p-1 active:opacity-60">
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
          {allSlots.map((day, index) => (
            <div key={index} className="h-28 relative pt-2">
              <div className="h-8 flex items-center justify-center">
                {day && (
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-[15px]
                      ${day === 11
                        ? "bg-[var(--color-core-1)] text-white"
                        : "text-text-black"
                      }`}
                  >
                    {day}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 일정 바 */}
        <div className="absolute top-[85px] left-0 w-full pointer-events-none">
          {/* 비플레인 */}
          <div
            className="absolute flex items-center justify-center text-[11px] text-white shadow-sm bg-grad-1"
            style={{
              left: "28.57%",
              width: "57.14%",
              height: "20px",
              borderRadius: "20px",
              top: "0px",
            }}
          >
            비플레인
          </div>

          {/* 라운드랩 */}
          <div
            className="absolute flex items-center justify-center text-[11px] text-white shadow-sm bg-grad-2"
            style={{
              left: "57.14%",
              width: "42.85%",
              height: "20px",
              borderRadius: "20px",
              top: "25px",
            }}
          >
            라운드랩
          </div>
        </div>

      </div>
    </div>
  );
}
