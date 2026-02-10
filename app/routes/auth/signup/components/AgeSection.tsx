import { useState } from "react";
import type { FieldValues, UseFormSetValue, Path } from "react-hook-form";
import { DatePickerModal } from "./DatePickerModal";

interface AgeSectionProps<T extends FieldValues> {
  setValue: UseFormSetValue<T>;
  initialValue?: string;
}

function parseInitialDate(initialValue?: string) {
  if (!initialValue) return null;
  const [year, month, day] = initialValue.split("-");
  if (year && month && day) {
    return { year, month: String(parseInt(month)), day: String(parseInt(day)) };
  }
  return null;
}

export function AgeSection<T extends FieldValues>({ setValue, initialValue }: AgeSectionProps<T>) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<{
    year: string;
    month: string;
    day: string;
  } | null>(() => parseInitialDate(initialValue));

  const handleDateSelect = (date: { year: string; month: string; day: string }) => {
    setSelectedDate(date);
    // form에 생년월일 저장 (YYYY-MM-DD 형식)
    const formattedDate = `${date.year}-${date.month.padStart(2, "0")}-${date.day.padStart(2, "0")}`;
    setValue("birthDate" as Path<T>, formattedDate as T[Path<T>]);
  };

  const displayText = selectedDate
    ? `${selectedDate.year}. ${selectedDate.month}. ${selectedDate.day}`
    : null;

  return (
    <div className="space-y-1">
      <h3 className="text-title1 text-text-black">생년월일</h3>
      <button
        type="button"
        onClick={() => setIsPickerOpen(true)}
        className="flex w-full h-[46px] px-4 items-center pl-4 rounded-xl border border-core-2 bg-bg-w-80"
      >
        {displayText ? (
          <span className="flex w-full justify-center text-callout1 text-core-1">{displayText}</span>
        ) : (
          <span className="flex w-full text-button text-core-1 justify-center">선택하기</span>
        )}
      </button>

      <DatePickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleDateSelect}
        initialValue={selectedDate || undefined}
      />
    </div>
  );
}
