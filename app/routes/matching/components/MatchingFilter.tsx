import { useState } from "react";
import { cn } from "../../../lib/utils";
import FilterChip from "../../../components/common/FilterChip";
import Button from "../../../components/common/Button";
import {
    SORT_OPTIONS,
    CAMPAIGN_SORT_OPTIONS,
    BEAUTY_FILTER,
    FASHION_FILTER,
    CONTENT_FILTER,
    type BeautyFilterKey,
    type FashionFilterKey,
    type ContentFilterKey,
} from "../../../data/filter";

type FilterType = "BEAUTY" | "FASHION" | "CONTENT";
type MainTab = "정렬 필터" | "뷰티 필터" | "패션 필터" | "콘텐츠 필터";

interface MatchingFilterProps {
    filterType: FilterType;
    selectedSort: string;
    selectedTags: string[];
    onApply: (sort: string, tags: string[]) => void;
    onClose: () => void;
    initialTab?: "sort" | "filter";
}

export default function MatchingFilter({
    filterType,
    selectedSort: initialSort,
    selectedTags: initialTags,
    onApply,
    onClose,
    initialTab,
}: MatchingFilterProps) {
    const [currentSort, setCurrentSort] = useState<string>(initialSort);
    const [currentTags, setCurrentTags] = useState<string[]>(initialTags);

    // 필터 타입에 따른 정렬 옵션 결정
    const sortOptions = filterType === "CONTENT" ? CAMPAIGN_SORT_OPTIONS : SORT_OPTIONS;

    // 필터 타입에 따른 메인 탭과 필터 데이터 결정
    const filterTabName: MainTab = filterType === "BEAUTY"
        ? "뷰티 필터"
        : filterType === "FASHION"
            ? "패션 필터"
            : "콘텐츠 필터";

    const filterData = filterType === "BEAUTY"
        ? BEAUTY_FILTER
        : filterType === "FASHION"
            ? FASHION_FILTER
            : CONTENT_FILTER;

    const subTabs = Object.keys(filterData) as (BeautyFilterKey | FashionFilterKey | ContentFilterKey)[];

    const [mainTab, setMainTab] = useState<MainTab>(initialTab === "filter" ? filterTabName : "정렬 필터");
    const [subTab, setSubTab] = useState<string>(subTabs[0]);

    const toggleTag = (tag: string) => {
        setCurrentTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const handleApply = () => {
        onApply(currentSort, currentTags);
        onClose();
    };

    const handleClearTags = () => {
        setCurrentTags([]);
    };

    return (
        <div className="flex flex-col h-full">
            {/* 메인 탭 */}
            <div className="flex">
                <button
                    type="button"
                    className="py-3 px-4 text-title3 cursor-pointer transition-colors text-text-black"
                    onClick={() => setMainTab("정렬 필터")}
                >
                    <span className={mainTab === "정렬 필터" ? "pb-3 border-b-2 border-core-1" : ""}>
                        정렬 필터
                    </span>
                </button>
                <button
                    type="button"
                    className="py-3 px-4 text-title3 cursor-pointer transition-colors text-text-black"
                    onClick={() => setMainTab(filterTabName)}
                >
                    <span className={mainTab === filterTabName ? "pb-3 border-b-2 border-core-1" : ""}>
                        {filterTabName}
                    </span>
                </button>
            </div>

            {/* 컨텐츠 영역 */}
            <div className="flex-1 px-4 text-[14px]">
                {mainTab === "정렬 필터" ? (
                    /* 정렬 필터 */
                    <div className="flex gap-4 bg-bluegray-1 -mx-4 px-4 py-3">
                        {sortOptions.map((option) => (
                            <button
                                key={option}
                                type="button"
                                className={cn(
                                    "cursor-pointer transition-colors text-title3 font-[14px]",
                                    currentSort === option
                                        ? "text-text-black"
                                        : "text-text-gray3"
                                )}
                                onClick={() => setCurrentSort(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                ) : (
                    /* 카테고리 필터 */
                    <div className="flex flex-col gap-4">
                        {/* 서브 탭 */}
                        <div className="flex gap-4 overflow-x-auto bg-bluegray-1 -mx-4 px-4 py-3">
                            {subTabs.map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    className={cn(
                                        "text-title3 cursor-pointer transition-colors whitespace-nowrap",
                                        subTab === tab
                                            ? "text-text-black"
                                            : "text-text-gray3"
                                    )}
                                    onClick={() => setSubTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* 태그 칩들 */}
                        <div className="flex flex-wrap gap-2 items-center">
                            <button
                                type="button"
                                className="flex items-center justify-center cursor-pointer"
                                onClick={handleClearTags}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M8.4 16.308L12 12.708L15.6 16.308L16.308 15.6L12.708 12L16.308 8.4L15.6 7.692L12 11.292L8.4 7.692L7.692 8.4L11.292 12L7.692 15.6L8.4 16.308ZM12.003 21C10.759 21 9.589 20.764 8.493 20.292C7.39767 19.8193 6.44467 19.178 5.634 18.368C4.82333 17.558 4.18167 16.606 3.709 15.512C3.23633 14.418 3 13.2483 3 12.003C3 10.7577 3.23633 9.58767 3.709 8.493C4.181 7.39767 4.82133 6.44467 5.63 5.634C6.43867 4.82333 7.391 4.18167 8.487 3.709C9.583 3.23633 10.753 3 11.997 3C13.241 3 14.411 3.23633 15.507 3.709C16.6023 4.181 17.5553 4.82167 18.366 5.631C19.1767 6.44033 19.8183 7.39267 20.291 8.488C20.7637 9.58333 21 10.753 21 11.997C21 13.241 20.764 14.411 20.292 15.507C19.82 16.603 19.1787 17.556 18.368 18.366C17.5573 19.176 16.6053 19.8177 15.512 20.291C14.4187 20.7643 13.249 21.0007 12.003 21Z" fill="#B7B7F3" />
                                </svg>
                            </button>
                            {(filterData[subTab as keyof typeof filterData] as readonly string[]).map((tag) => (
                                <FilterChip
                                    key={tag}
                                    label={tag}
                                    selected={currentTags.includes(tag)}
                                    onClick={() => toggleTag(tag)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 적용하기 버튼 */}
            <div className="p-4 pb-8">
                <Button
                    variant="primary"
                    className="w-full text-title7"
                    onClick={handleApply}
                >
                    적용하기
                </Button>
            </div>
        </div>
    );
}
