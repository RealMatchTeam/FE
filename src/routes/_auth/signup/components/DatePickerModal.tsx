import { useState, useMemo } from "react";
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

  if (!isOpen) return null;

  const handleSelect = () => {
    onSelect(pickerValue);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative flex w-[310px] flex-col justify-end items-center gap-16 p-4 pb-5 px-5 rounded-[10px] bg-white">
        {/* 헤더 */}
        <h3 className="text-title2 text-text-black text-center pt-5.5">
          생년월일을 입력해주세요
        </h3>

        {/* 피커 */}
        <div className="w-full">
          <Picker
            value={pickerValue}
            onChange={setPickerValue}
            wheelMode="natural"
            height={180}
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
        <Button
          type="button"
          variant="primary"
          size="action"
          fullWidth
          onClick={handleSelect}
        >
          선택 완료
        </Button>
      </div>
    </div>
  );
}
