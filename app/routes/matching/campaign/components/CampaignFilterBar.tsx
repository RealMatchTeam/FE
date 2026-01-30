import Button from "../../../../components/common/Button";
import SearchBar from "../../../../components/common/SearchBar";
import type { CampaignCategory } from "../../../../../data/campaign";
import { cn } from "../../../../../lib/utils";

interface CampaignFilterBarProps {
    category: CampaignCategory;
    onCategoryChange: (category: CampaignCategory) => void;
    searchKeyword: string;
    onSearchChange: (keyword: string) => void;
}

export default function CampaignFilterBar({ category, onCategoryChange, searchKeyword, onSearchChange }: CampaignFilterBarProps) {
    return (
        <div className="px-4 py-4 bg-core-2 sticky top-0 z-10 shrink-0 space-y-4">
            <div className="flex w-full gap-2">
                <div className="flex gap-2 flex-[3] min-w-0">
                    <Button
                        className={cn(
                            "flex-1 flex justify-center items-center gap-[10px] px-[10px] py-[8px] !h-auto !text-title2 !rounded-[8px] whitespace-nowrap cursor-pointer transition-colors",
                            category === "BEAUTY"
                                ? "!bg-core-1 !text-white"
                                : "!bg-white !text-text-gray3 border !border-gray-100"
                        )}
                        onClick={() => onCategoryChange("BEAUTY")}
                    >
                        뷰티
                    </Button>
                    <Button
                        className={cn(
                            "flex-1 flex justify-center items-center gap-[10px] px-[10px] py-[8px] !h-auto !text-title2 !rounded-[8px] whitespace-nowrap cursor-pointer transition-colors",
                            category === "FASHION"
                                ? "!bg-core-1 !text-white"
                                : "!bg-white !text-text-gray3 border !border-gray-100"
                        )}
                        onClick={() => onCategoryChange("FASHION")}
                    >
                        패션
                    </Button>
                </div>
                <div className="flex-[7] min-w-0 justify-center">
                    <SearchBar placeholder="캠페인 검색" className="w-full" value={searchKeyword} onChange={onSearchChange} />
                </div>
            </div>
        </div>
    );
}
