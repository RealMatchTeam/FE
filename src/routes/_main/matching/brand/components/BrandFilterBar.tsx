import Button from "../../../../../components/common/Button";
import SearchBar from "../../../../../components/common/SearchBar";

type Category = "BEAUTY" | "FASHION";

interface BrandFilterBarProps {
    category: Category;
    onCategoryChange: (category: Category) => void;
}

export default function BrandFilterBar({ category, onCategoryChange }: BrandFilterBarProps) {
    return (
        <div className="px-4 py-4 bg-white sticky top-0 z-10 shrink-0 space-y-4">
            <div className="flex w-full gap-2">
                <div className="flex gap-2 flex-[3] min-w-0">
                    <Button
                        className={`flex-1 flex justify-center items-center gap-[10px] px-[10px] py-[8px] !h-auto !text-title2 !rounded-[8px] whitespace-nowrap ${category === "BEAUTY"
                            ? "!bg-core-1 !text-white"
                            : "!bg-white !text-text-gray3 border !border-gray-100"
                            }`}
                        onClick={() => onCategoryChange("BEAUTY")}
                    >
                        뷰티
                    </Button>
                    <Button
                        className={`flex-1 flex justify-center items-center gap-[10px] px-[10px] py-[8px] !h-auto !text-title2 !rounded-[8px] whitespace-nowrap ${category === "FASHION"
                            ? "!bg-core-1 !text-white"
                            : "!bg-white !text-text-gray3 border !border-gray-100"
                            }`}
                        onClick={() => onCategoryChange("FASHION")}
                    >
                        패션
                    </Button>
                </div>
                <div className="flex-[7] min-w-0 justify-center">
                    <SearchBar placeholder="브랜드 검색" className="w-full" />
                </div>
            </div>
        </div>
    );
}
