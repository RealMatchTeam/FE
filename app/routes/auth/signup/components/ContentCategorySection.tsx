import { useState } from "react";
import { cn } from "../../../../lib/utils";
import FilterBottomSheet from "../../../../components/common/FilterBottomSheet";
import Button from "../../../../components/common/Button";
import { CheckIcon } from "../../components/CheckIcon";

interface ContentCategorySectionProps {
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
}

const CONTENT_CATEGORIES = ["패션", "뷰티"];

export function ContentCategorySection({
  selectedCategories,
  onToggleCategory,
}: ContentCategorySectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-1">
      <h3 className="text-title1 text-text-black">콘텐츠 분야</h3>
      <div className="flex flex-col gap-1.5">
        <p className="text-callout4 text-text-gray3">
          * 해당하는 콘텐츠를 <span className="text-callout4 text-core-1">모두</span> 선택해주세요
        </p>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex w-full min-h-[46px] px-4 py-3 items-center justify-center rounded-xl border border-core-2 bg-bg-w-80"
          >
            {selectedCategories.length > 0 ? (
              <div className="flex flex-col items-center gap-1.5 self-stretch w-full">
                {selectedCategories.map((category) => (
                  <span key={category} className="text-callout1 text-core-1 text-center">
                    {category}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-button text-core-1">선택하기</span>
            )}
          </button>
        </div>
      </div>

      <FilterBottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} className="h-[40%] max-w-[430px]">
        <div className="flex flex-col h-full px-5 pb-6">
          {/* 헤더 */}
          <div className="flex justify-between items-center py-5.5">
            <span className="text-title2 text-text-black px-1.5 py-1">콘텐츠 분야 선택</span>
            <button onClick={() => setIsOpen(false)} className="p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M0.75 10.75L5.75 5.75L10.75 10.75M10.75 0.75L5.74905 5.75L0.75 0.75" stroke="#5B5D6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* 옵션 리스트 */}
          <div className="flex flex-col pt-2 gap-3 flex-1 overflow-y-auto">
            {CONTENT_CATEGORIES.map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onToggleCategory(category)}
                  style={{
                    backgroundColor: isSelected ? "#B7B7F380" : "var(--color-bg-w-80)",
                    color: isSelected ? "var(--color-core-1)" : "var(--color-text-gray1)",
                  }}
                  className={cn(
                    "w-full py-4 px-5 rounded-[12px] flex items-center justify-center gap-2 transition-all relative text-title3"
                  )}
                >
                  {/* 체크박스 */}
                  <div className="absolute left-5 flex items-center">
                    <CheckIcon checked={isSelected} />
                  </div>

                  <span>{category}</span>
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
