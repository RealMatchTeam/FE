import { useState } from "react";

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filter: string) => void;
  currentFilter: string;
}

const FILTERS = ["전체", "검토 중", "매칭", "거절"];

export default function FilterBottomSheet({
  isOpen,
  onClose,
  onApply,
  currentFilter,
}: FilterBottomSheetProps) {
  const [selected, setSelected] = useState(currentFilter);

  if (!isOpen) return null;

  return (
    /* 최상위 컨테이너 */
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-end">
      
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/40" 
        onClick={onClose} 
      />

      {/* 바텀 시트 본체 */}
      <div 
        className="relative bg-[var(--color-bg-w)] rounded-t-[24px] overflow-hidden animate-slide-up w-full max-w-[430px] h-[530px] flex flex-col"
      >
        {/* 1. 헤더 영역 */}
        <div className="px-4 pt-8 pb-4">
          <div className="inline-block border-b-2 border-[var(--color-core-1)] pb-1">
            <span className="text-title7 text-[var(--color-text-black)]">정렬 필터</span>
          </div>
        </div>
        
        {/* 2. 필터 옵션 영역 */}
        <div className="w-full bg-[var(--color-bluegray-1)] py-4">
          <div className="flex items-center justify-start gap-8 px-4">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelected(filter)}
                className={`text-title3 transition-colors whitespace-nowrap ${
                  selected === filter 
                    ? "text-[var(--color-text-black)] font-bold" 
                    : "text-[var(--color-text-gray3)]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* 3. 하단 적용하기 버튼 */}
        <div className="mt-auto px-4 pb-10">
          <button
            onClick={() => {
              onApply(selected);
              onClose();
            }}
            className="w-full py-4 bg-[var(--color-core-1)] text-white rounded-xl text-title1 active:opacity-90"
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
}