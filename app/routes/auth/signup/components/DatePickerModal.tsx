import { useState, useMemo, useEffect } from "react";
import Picker from "react-mobile-picker";
import Button from "../../../../components/common/Button";

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (date: { year: string; month: string; day: string }) => void;
  initialValue?: { year: string; month: string; day: string };
}

export function DatePickerModal({
  isOpen,
  onClose,
  onSelect,
  initialValue,
}: DatePickerModalProps) {
  const currentYear = new Date().getFullYear();

  const years = useMemo(() =>
    Array.from({ length: 100 }, (_, i) => String(currentYear - i)),
    [currentYear]
  );
  const months = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => String(i + 1)),
    []
  );
  const days = useMemo(() =>
    Array.from({ length: 31 }, (_, i) => String(i + 1)),
    []
  );

  const [pickerValue, setPickerValue] = useState({
    year: initialValue?.year || String(currentYear - 20),
    month: initialValue?.month || "1",
    day: initialValue?.day || "1",
  });

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = () => {
    onSelect(pickerValue);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* 바텀시트 컨텐츠 */}
      <div className="relative w-full max-w-[430px] bg-white rounded-t-[20px] pb-6 animate-slide-up">
        <div className="flex flex-col h-full px-5">
          {/* 헤더 */}
          <div className="relative flex items-center justify-center py-5.5">
            <span className="text-title2 text-text-black px-1.5 py-1">생년월일 선택</span>
            <button onClick={onClose} className="absolute right-0 p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M0.75 10.75L5.75 5.75L10.75 10.75M10.75 0.75L5.74905 5.75L0.75 0.75" stroke="#5B5D6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* 피커 */}
          <div className="w-full py-4">
            <Picker
              value={pickerValue}
              onChange={setPickerValue}
              wheelMode="natural"
              height={200}
            >
              <Picker.Column name="year">
                {years.map((year) => (
                  <Picker.Item key={year} value={year}>
                    {({ selected }) => (
                      <span className={`text-title2 ${selected ? "text-text-black" : "text-text-gray4"}`}>
                        {year}년
                      </span>
                    )}
                  </Picker.Item>
                ))}
              </Picker.Column>
              <Picker.Column name="month">
                {months.map((month) => (
                  <Picker.Item key={month} value={month}>
                    {({ selected }) => (
                      <span className={`text-title2 ${selected ? "text-text-black" : "text-text-gray4"}`}>
                        {month}월
                      </span>
                    )}
                  </Picker.Item>
                ))}
              </Picker.Column>
              <Picker.Column name="day">
                {days.map((day) => (
                  <Picker.Item key={day} value={day}>
                    {({ selected }) => (
                      <span className={`text-title2 ${selected ? "text-text-black" : "text-text-gray4"}`}>
                        {day}일
                      </span>
                    )}
                  </Picker.Item>
                ))}
              </Picker.Column>
            </Picker>
          </div>

          {/* 선택 버튼 */}
          <div className="pt-4">
            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleSelect}
            >
              선택 완료
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
