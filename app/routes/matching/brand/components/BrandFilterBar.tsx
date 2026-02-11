import SearchBar from "../../../../components/common/SearchBar";
import type { BrandCategory } from "../../../../data/brand";
import { cn } from "../../../../lib/utils";

interface BrandFilterBarProps {
    category: BrandCategory;
    onCategoryChange: (category: BrandCategory) => void;
    searchKeyword: string;
    onSearchChange: (keyword: string) => void;
}

export default function BrandFilterBar({ category, onCategoryChange, searchKeyword, onSearchChange }: BrandFilterBarProps) {
    return (
        <div className="px-4 py-3 shrink-0 space-y-4 bg-transparent">
            <div className="flex w-full gap-3 items-center">
                <div className="flex gap-2 shrink-0">
                    <button
                        className={cn(
                            "px-[12px] py-[8px] h-10 text-title2 rounded-[8px] whitespace-nowrap cursor-pointer transition-colors font-semibold",
                            category === "BEAUTY"
                                ? "bg-core-1 text-white"
                                : "bg-white text-text-gray3 border border-gray-100"
                        )}
                        onClick={() => onCategoryChange("BEAUTY")}
                    >
                        뷰티
                    </button>
                    <button
                        className={cn(
                            "px-[12px] py-[8px] h-10 text-title2 rounded-[8px] whitespace-nowrap cursor-pointer transition-colors font-semibold",
                            category === "FASHION"
                                ? "bg-core-1 text-white"
                                : "bg-white text-text-gray3 border border-gray-100"
                        )}
                        onClick={() => onCategoryChange("FASHION")}
                    >
                        패션
                    </button>
                </div>
                <div className="flex-1 min-w-0">
                    <SearchBar placeholder="브랜드 검색" className="w-full" value={searchKeyword} onChange={onSearchChange} />
                </div>
            </div>
        </div>
    );
}
