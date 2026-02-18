import { useState, useMemo, useDeferredValue } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import FilterButton from "../../../components/common/FilterButton";
import BrandCard from "./components/BrandCard";
import { type BrandCategory } from "../../../data/brand";
import BrandFilterBar from "./components/BrandFilterBar";
import BottomSheet from "../../../components/common/BottomSheet";
import MatchingFilter from "../components/MatchingFilter";
import { useHideBottomTab } from "../../../hooks/useHideBottomTab";
import EmptyMatchState from "../../../components/common/EmptyMatchState";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { getMatchingBrands, toggleBrandLike, type MatchingBrand, MatchingTestRequiredError } from "../api/matching";

export default function BrandContent() {
    const [searchParams] = useSearchParams();
    const category = (searchParams.get("type") || "BEAUTY") as BrandCategory;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // 필터 상태
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterOpenTab, setFilterOpenTab] = useState<"sort" | "filter">("sort");
    const [sortOption, setSortOption] = useState("매칭률 순");
    const [sortApplied, setSortApplied] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // 검색 상태
    const [searchKeyword, setSearchKeyword] = useState(searchParams.get("search") || "");
    const deferredKeyword = useDeferredValue(searchKeyword);

    // 정렬 옵션 매핑
    const sortByMap: Record<string, string> = {
        "정렬 필터": "MATCH_SCORE",
        "매칭률 순": "MATCH_SCORE",
        "인기 순": "POPULARITY",
        "신규 순": "NEWEST",
    };
    const sortBy = sortByMap[sortOption] || "MATCH_SCORE";

    // 데이터 페칭
    const {
        data,
        isLoading,
        error
    } = useInfiniteQuery({
        queryKey: ["matching-brands", category, sortOption, selectedTags],
        queryFn: async () => {
            const response = await getMatchingBrands(sortBy, category, selectedTags.length > 0 ? selectedTags : undefined);
            return response;
        },
        initialPageParam: 0,
        getNextPageParam: () => undefined,
        staleTime: 1000 * 60 * 1, // 1분간 캐시 유지
    });

    const brands = useMemo(() => {
        return data?.pages.flatMap(page => page.brands) || [];
    }, [data]);

    // 바텀탭 숨기기
    useHideBottomTab(isFilterOpen);

    const handleCategoryChange = (newCategory: BrandCategory) => {
        navigate(`/matching/brand?type=${newCategory}`);
    };

    // 검색어 필터링
    const filteredBrands = useMemo(() => {
        return brands.filter(brand => {
            const matchesSearch = deferredKeyword === "" ||
                brand.name.toLowerCase().includes(deferredKeyword.toLowerCase()) ||
                (brand.tags && brand.tags.some((tag: string) => tag.toLowerCase().includes(deferredKeyword.toLowerCase())));
            return matchesSearch;
        });
    }, [brands, deferredKeyword]);

    const toggleLike = async (id: number) => {
        const queryKey = ["matching-brands", category, sortOption, selectedTags];

        // 낙관적 업데이트
        queryClient.setQueryData(queryKey, (oldData: { pages: { brands: MatchingBrand[] }[] } | undefined) => {
            if (!oldData) return oldData;
            return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                    ...page,
                    brands: page.brands.map((brand: MatchingBrand) =>
                        brand.id === id ? { ...brand, isLiked: !brand.isLiked } : brand
                    )
                }))
            };
        });

        try {
            await toggleBrandLike(id);
        } catch (error) {
            console.error("브랜드 좋아요 토글 실패:", error);
            // 실패 시 롤백
            queryClient.setQueryData(queryKey, (oldData: { pages: { brands: MatchingBrand[] }[] } | undefined) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        brands: page.brands.map((brand: MatchingBrand) =>
                            brand.id === id ? { ...brand, isLiked: !brand.isLiked } : brand
                        )
                    }))
                };
            });
        }
    };

    const handleFilterApply = (sort: string, tags: string[]) => {
        setSortOption(sort);
        setSelectedTags(tags);
        setSortApplied(true);
    };


    const getFilterButtonLabel = () => {
        if (selectedTags.length > 0) {
            return selectedTags.slice(0, 2).join(", ") + (selectedTags.length > 2 ? "..." : "");
        }
        return category === "BEAUTY" ? "뷰티 필터" : "패션 필터";
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full" style={{ background: "linear-gradient(180deg, #F6F6FF 0%, #F3F3FA 48.08%, #E8E8FB 100%)" }}>
                <LoadingSpinner />
            </div>
        );
    }

    // 매칭 검사를 안한 경우
    if (error instanceof MatchingTestRequiredError) {
        return <EmptyMatchState
            message={`매칭된 기업이 없어요\n매칭 검사를 먼저 진행해주세요`}
            showButton={true}
            buttonText="매칭 검사하기"
            contentClassName="pb-14"
        />
    }

    // 기타 에러
    if (error) {
        console.error("Failed to fetch matching brands:", error);
        return (
            <div className="flex items-center justify-center h-full" style={{ background: "linear-gradient(180deg, #F6F6FF 0%, #F3F3FA 48.08%, #E8E8FB 100%)" }}>
                <div className="text-lg text-text-gray3">오류가 발생했습니다</div>
            </div>
        );
    }

    // 매칭 결과가 있을 때
    return (
        <div className="flex flex-col h-full" style={{ background: "linear-gradient(180deg, #F6F6FF 0%, #F3F3FA 48.08%, #E8E8FB 100%)" }}>
            {/* 뷰티/패션 필터 & 검색창 */}
            <BrandFilterBar
                category={category}
                onCategoryChange={handleCategoryChange}
                searchKeyword={searchKeyword}
                onSearchChange={setSearchKeyword}
            />

            {/* 메인 컨텐츠 */}
            <div className="flex-1 px-4 py-6 overflow-y-auto">
                {/* 타이틀 & 필터 */}
                <div className="mb-4">
                    <h2 className="text-title1 mb-4">브랜드 리스트</h2>
                    <div className="flex gap-2">
                        <FilterButton
                            label={sortOption}
                            isActive={sortApplied}
                            onClick={() => { setFilterOpenTab("sort"); setIsFilterOpen(true); }}
                        />
                        <FilterButton
                            label={getFilterButtonLabel()}
                            isActive={selectedTags.length > 0}
                            onClick={() => { setFilterOpenTab("filter"); setIsFilterOpen(true); }}
                            className="bg-transparent border-core-1"
                        />
                    </div>
                </div>

                {/* 브랜드 리스트 */}
                <div className="space-y-3 pb-20">
                    {filteredBrands.map((brand) => (
                        <BrandCard
                            key={brand.id}
                            name={brand.name}
                            matchRate={brand.matchingRatio || brand.matchRate}
                            tags={brand.tags || []}
                            isLiked={brand.isLiked}
                            onLike={() => toggleLike(brand.id)}
                            onClick={() => navigate(`/brand?brandId=${brand.id}&domain=${category.toLowerCase()}`)}
                            logoUrl={brand.logoUrl || `/dummy-logo-${brand.id}.png`}
                        />
                    ))}
                </div>
            </div>

            {/* 필터 바텀시트 */}
            <BottomSheet
                open={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                height={500}
            >
                <MatchingFilter
                    filterType={category}
                    selectedSort={sortOption}
                    selectedTags={selectedTags}
                    onApply={handleFilterApply}
                    onClose={() => setIsFilterOpen(false)}
                    initialTab={filterOpenTab}
                />
            </BottomSheet>
        </div>
    );
}
