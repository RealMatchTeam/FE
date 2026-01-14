import { useState } from "react";
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

  const handleToggle = (category: string) => {
    onToggleCategory(category);
  };

  return (
    <div className="space-y-1">
      <h3 className="text-title1 text-text-black">콘텐츠 분야</h3>
      <div className="flex flex-col gap-1">
        <p className="text-callout4 text-text-gray3">
          * 해당하는 콘텐츠를 <span className="text-callout4 text-core-1">모두</span> 선택해주세요
        </p>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
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
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-core-2 rounded-xl overflow-hidden shadow-lg">
              {CONTENT_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleToggle(category)}
                  className="w-full px-4 py-3 flex items-center justify-center gap-2 text-title4 text-core-1 hover:bg-core-70 transition-colors"
                >
                  <CheckIcon checked={selectedCategories.includes(category)} />
                  <span>{category}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
