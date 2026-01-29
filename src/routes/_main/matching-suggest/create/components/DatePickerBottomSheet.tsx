import { useState, useMemo } from "react";
import FilterBottomSheet from "../../../../../components/common/FilterBottomSheet";
import Button from "../../../../../components/common/Button";
import ArrowLeftIcon from "../../../../../assets/icon/arrow-left.svg";
import ArrowRightIcon from "../../../../../assets/icon/arrow-right.svg";

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

interface DatePickerBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (dateString: string) => void;
  initialValue?: string; // "YYYY-MM-DD" 형식
}

export default function DatePickerBottomSheet({
  isOpen,
  onClose,
  onSelect,
  initialValue,
}: DatePickerBottomSheetProps) {
  // initialValue 파싱
  const parseInitialDate = () => {
    if (initialValue) {
      const date = new Date(initialValue);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    return new Date();
  };

  const initialDate = parseInitialDate();
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(
    initialValue ? initialDate.getDate() : null
  );

  // 해당 월의 첫 날 요일 (0: 일요일)
  const firstDayOfMonth = useMemo(
    () => new Date(currentYear, currentMonth, 1).getDay(),
    [currentYear, currentMonth]
  );

  // 해당 월의 마지막 날짜
  const daysInMonth = useMemo(
    () => new Date(currentYear, currentMonth + 1, 0).getDate(),
    [currentYear, currentMonth]
  );

  // 캘린더 그리드 생성
  const calendarDays = useMemo(() => {
    const emptyDays = Array(firstDayOfMonth).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return [...emptyDays, ...days];
  }, [firstDayOfMonth, daysInMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(null);
  };

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
  };

  const handleSubmit = () => {
    if (selectedDay) {
      const month = String(currentMonth + 1).padStart(2, "0");
      const day = String(selectedDay).padStart(2, "0");
      onSelect(`${currentYear}-${month}-${day}`);
      onClose();
    }
  };

  return (
    <FilterBottomSheet isOpen={isOpen} onClose={onClose} className="h-auto">
      <div className="flex flex-col px-5 pt-4 pb-6">
        {/* 월 네비게이션 */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1 active:opacity-60"
          >
            <img src={ArrowLeftIcon} alt="이전 달" className="w-5 h-5" />
          </button>
          <span className="mx-2 text-[17px] font-bold text-text-black">
            {currentYear}년 {String(currentMonth + 1).padStart(2, "0")}월
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 active:opacity-60"
          >
            <img src={ArrowRightIcon} alt="다음 달" className="w-5 h-5" />
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 mb-2 text-center text-[13px] text-text-gray3">
          {WEEK_DAYS.map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 text-center gap-y-2 mb-6">
          {calendarDays.map((day, index) => (
            <div key={index} className="flex items-center justify-center h-10">
              {day && (
                <button
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`w-10 h-10 rounded-full text-[15px] flex items-center justify-center transition-colors ${
                    selectedDay === day
                      ? "bg-core-1 text-white"
                      : "text-text-black hover:bg-bluegray-1"
                  }`}
                >
                  {day}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 선택 버튼 */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSubmit}
          disabled={!selectedDay}
        >
          선택 완료
        </Button>
      </div>
    </FilterBottomSheet>
  );
}
