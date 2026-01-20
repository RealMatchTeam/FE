import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import FilterButton from "../../../../components/common/FilterButton";
import BrandCard from "./components/BrandCard";
import { BRAND_DATA, type BrandCategory } from "../../../../data/brand";
import BrandFilterBar from "./components/BrandFilterBar";
import { Route } from "./route";
import FilterBottomSheet from "../../../../components/common/FilterBottomSheet";
import MatchingFilter from "../components/MatchingFilter";


export default function BrandContent() {
    const { type: category = "BEAUTY" } = Route.useSearch();
    const navigate = useNavigate();
    const [brands, setBrands] = useState(BRAND_DATA);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortOption, setSortOption] = useState("정렬 필터");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleCategoryChange = (newCategory: BrandCategory) => {
        navigate({
            to: "/matching/brand",
            search: { type: newCategory },
        });
    };

    // 카테고리별 필터링
    const filteredBrands = useMemo(() => {
        return brands.filter(brand => brand.category === category);
    }, [brands, category]);

    const toggleLike = (id: number) => {
        setBrands(prev => prev.map(brand =>
            brand.id === id ? { ...brand, isLiked: !brand.isLiked } : brand
        ));
    };

    const handleFilterApply = (sort: string, tags: string[]) => {
        setSortOption(sort);
        setSelectedTags(tags);
        // TODO: 정렬 및 태그 필터 적용 로직
    };

    const getSortButtonLabel = () => {
        return sortOption;
    };

    const getFilterButtonLabel = () => {
        if (selectedTags.length > 0) {
            return selectedTags.slice(0, 2).join(", ") + (selectedTags.length > 2 ? "..." : "");
        }
        return category === "BEAUTY" ? "뷰티 필터" : "패션 필터";
    };

    return (
        <div className="flex flex-col h-full bg-core-2">
            {/* 뷰티/패션 필터 & 검색창 */}
            <BrandFilterBar category={category} onCategoryChange={handleCategoryChange} />

            {/* 메인 컨텐츠 */}
            <div className="flex-1 px-4 py-6 overflow-y-auto">
                {/* 타이틀 & 필터 */}
                <div className="mb-4">
                    <h2 className="text-title1 mb-3">브랜드 리스트</h2>
                    <div className="flex gap-2">
                        <FilterButton
                            label={getSortButtonLabel()}
                            isActive={sortOption !== "정렬 필터"}
                            onClick={() => setIsFilterOpen(true)}
                        />
                        <FilterButton
                            label={getFilterButtonLabel()}
                            isActive={selectedTags.length > 0}
                            onClick={() => setIsFilterOpen(true)}
                        />
                    </div>
                </div>

                {/* 브랜드 리스트 */}
                <div className="space-y-3 pb-20">
                    {filteredBrands.map((brand) => (
                        <BrandCard
                            key={brand.id}
                            name={brand.name}
                            matchRate={brand.matchRate}
                            tags={brand.tags}
                            isLiked={brand.isLiked}
                            onLike={() => toggleLike(brand.id)}
                            logoUrl={`/dummy-logo-${brand.id}.png`}
                        />
                    ))}
                </div>
            </div>

            {/* 필터 바텀시트 */}
            <FilterBottomSheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
                <MatchingFilter
                    filterType={category}
                    selectedSort={sortOption}
                    selectedTags={selectedTags}
                    onApply={handleFilterApply}
                    onClose={() => setIsFilterOpen(false)}
                />
            </FilterBottomSheet>
        </div>
    );
}
