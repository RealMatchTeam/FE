import { useState } from "react";
import type { FieldValues, Path, PathValue, UseFormSetValue } from "react-hook-form";
import FilterBottomSheet from "../../../components/common/FilterBottomSheet";
import Button from "../../../components/common/Button";
import { cn } from "../../../../lib/utils";

interface GenderSectionProps<T extends FieldValues> {
  genderValue: string | undefined;
  setValue: UseFormSetValue<T>;
}

export function GenderSection<T extends FieldValues>({ genderValue, setValue }: GenderSectionProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const handleSelect = (value: string) => {
    setValue("gender" as Path<T>, value as PathValue<T, Path<T>>);
  };

  return (
    <div className="space-y-1">
      <h3 className="text-title1 text-text-black">성별</h3>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex w-full h-[46px] px-4 items-center justify-center pl-4 rounded-xl border border-core-2 bg-bg-w-80"
        >
          <span className={genderValue ? "text-callout1 text-core-1" : "text-button text-core-1"}>
            {genderValue || "선택하기"}
          </span>
        </button>
      </div>

      {/* 바텀시트 */}
      <FilterBottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} className="h-[32%]">
        <div className="flex flex-col h-full px-5 pb-6">
          {/* 헤더 */}
          <div className="relative flex items-center py-5.5">
            <span className="text-title2 text-text-black px-1.5 py-1">성별 선택</span>
            <button onClick={() => setIsOpen(false)} className="absolute right-0 p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M0.75 10.75L5.75 5.75L10.75 10.75M10.75 0.75L5.74905 5.75L0.75 0.75" stroke="#5B5D6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* 옵션 리스트 */}
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto pt-2">
            {["여성", "남성"].map((gender) => {
              const isSelected = genderValue === gender;
              return (
                <button
                  key={gender}
                  type="button"
                  onClick={() => handleSelect(gender)}
                  style={{
                    backgroundColor: isSelected ? "#B7B7F380" : "var(--color-bg-w-80)",
                    color: isSelected ? "var(--color-core-1)" : "var(--color-text-gray1)",
                  }}
                  className={cn(
                    "w-full py-4 rounded-[12px] text-center transition-all text-title3"
                  )}
                >
                  {gender}
                </button>
              );
            })}
          </div>

          {/* 하단 완료 버튼 */}
          <div className="pt-4">
            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setIsOpen(false)}
            >
              선택 완료
            </Button>
          </div>
        </div>
      </FilterBottomSheet>
    </div>
  );
}
