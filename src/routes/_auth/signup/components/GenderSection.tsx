import { useState } from "react";
import type { FieldValues, Path, PathValue, UseFormSetValue } from "react-hook-form";

interface GenderSectionProps<T extends FieldValues> {
  genderValue: string | undefined;
  setValue: UseFormSetValue<T>;
}

export function GenderSection<T extends FieldValues>({ genderValue, setValue }: GenderSectionProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-1">
      <h3 className="text-title1 text-text-black">성별</h3>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full h-[46px] px-4 items-center justify-center gap-[10px] rounded-xl border border-core-2 bg-bg-w-80"
        >
          <span className={genderValue ? "text-callout1 text-core-1" : "text-button text-core-1"}>
            {genderValue || "선택하기"}
          </span>
        </button>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-core-2 rounded-xl overflow-hidden shadow-lg">
            {["여성", "남성"].map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => {
                  setValue("gender" as Path<T>, gender as PathValue<T, Path<T>>);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-center text-title4 text-core-1 hover:bg-core-70 transition-colors"
              >
                {gender}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
