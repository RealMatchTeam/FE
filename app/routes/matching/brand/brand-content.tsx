import { useState, useMemo, useDeferredValue, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import FilterButton from "../../../components/common/FilterButton";
import BrandCard from "./components/BrandCard";
import { type BrandCategory } from "../../../data/brand";
import BrandFilterBar from "./components/BrandFilterBar";
import FilterBottomSheet from "../../../components/common/FilterBottomSheet";
import MatchingFilter from "../components/MatchingFilter";
import { useHideBottomTab } from "../../../hooks/useHideBottomTab";
import MainIcon from "../../../assets/MainIcon.svg";
import MiniLogo from "../../../assets/logo/mini-logo.svg";
import Button from "../../../components/common/Button";
import { getMatchingBrands, toggleBrandLike, MatchingTestRequiredError, type MatchingBrand } from "../api/matching";

export default function BrandContent() {
    const [searchParams] = useSearchParams();
    const category = (searchParams.get("type") || "BEAUTY") as BrandCategory;
    const navigate = useNavigate();
    const [brands, setBrands] = useState<MatchingBrand[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortOption, setSortOption] = useState("정렬 필터");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const deferredKeyword = useDeferredValue(searchKeyword);
    const [hasMatchingResult, setHasMatchingResult] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMatchingBrands = async () => {
            try {
                const { brands } = await getMatchingBrands("MATCH_SCORE", category);

                if (brands && brands.length > 0) {
                    setBrands(brands);
                    setHasMatchingResult(true);
                } else {
                    setHasMatchingResult(false);
                }
            } catch (error) {
                console.error("Failed to fetch matching brands:", error);

                // 매칭 검사 필요 에러인 경우
                if (error instanceof MatchingTestRequiredError) {
                    setHasMatchingResult(false);
                } else {
                    setHasMatchingResult(false);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchMatchingBrands();
    }, [category]);

    // 바텀탭 숨기기
    useHideBottomTab(isFilterOpen);

    const handleCategoryChange = (newCategory: BrandCategory) => {
        navigate(`/matching/brand?type=${newCategory}`);
    };

    // 검색어 필터링 (카테고리는 API에서 이미 필터링됨)
    const filteredBrands = useMemo(() => {
        return brands.filter(brand => {
            const matchesSearch = deferredKeyword === "" ||
                brand.name.toLowerCase().includes(deferredKeyword.toLowerCase()) ||
                (brand.tags && brand.tags.some((tag: string) => tag.toLowerCase().includes(deferredKeyword.toLowerCase())));
            return matchesSearch;
        });
    }, [brands, deferredKeyword]);

    const toggleLike = async (id: number) => {
        try {
            // 낙관적 업데이트 (UI 먼저 업데이트)
            setBrands(prev => prev.map(brand =>
                brand.id === id ? { ...brand, isLiked: !brand.isLiked } : brand
            ));

            // API 호출
            const newLikeStatus = await toggleBrandLike(id);

            // API 응답에 따라 상태 동기화
            setBrands(prev => prev.map(brand =>
                brand.id === id ? { ...brand, isLiked: newLikeStatus } : brand
            ));
        } catch (error) {
            console.error("Failed to toggle brand like:", error);
            // 에러 발생 시 원래 상태로 복구
            setBrands(prev => prev.map(brand =>
                brand.id === id ? { ...brand, isLiked: !brand.isLiked } : brand
            ));
        }
    };

    const handleFilterApply = async (sort: string, tags: string[]) => {
        setSortOption(sort);
        setSelectedTags(tags);

        // 정렬 및 태그 필터 적용하여 브랜드 목록 재조회
        try {
            setIsLoading(true);

            // sortBy 변환 (UI 라벨 -> API 파라미터)
            const sortByMap: Record<string, string> = {
                "정렬 필터": "MATCH_SCORE",
                "매칭률 순": "MATCH_SCORE",
                "인기 순": "POPULARITY",
                "신규 순": "NEWEST",
            };
            const sortBy = sortByMap[sort] || "MATCH_SCORE";

            const { brands } = await getMatchingBrands(sortBy, category, tags.length > 0 ? tags : undefined);

            if (brands && brands.length > 0) {
                setBrands(brands);
            }
        } catch (error) {
            console.error("Failed to apply filters:", error);
        } finally {
            setIsLoading(false);
        }
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

    // 로딩 중
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full bg-core-2">
                <div className="text-lg text-text-gray3">로딩 중...</div>
            </div>
        );
    }

    // 매칭 결과가 없을 때
    if (hasMatchingResult === false) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-[#E8E8F8] to-white px-6">
                <img src={MainIcon} alt="No matching" className="w-[200px] h-auto mb-6" />
                <p className="text-title1 text-text-black text-center mb-2">
                    매칭된 기업이 없어요
                </p>
                <p className="text-body2 text-text-gray3 text-center mb-8">
                    매칭 검사를 먼저 진행해주세요
                </p>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate("/matching/test/step1")}
                    className="w-full max-w-[300px] flex items-center justify-center gap-2"
                >
                    <img src={MiniLogo} alt="logo" className="w-5 h-5" />
                    매칭 검사하기
                </Button>
            </div>
        );
    }

    // 매칭 결과가 있을 때
    return (
        <div className="flex flex-col h-full bg-core-2">
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
                            matchRate={brand.matchingRatio || brand.matchRate}
                            tags={brand.tags || []}
                            isLiked={brand.isLiked}
                            onLike={() => toggleLike(brand.id)}
                            logoUrl={brand.logoUrl || `/dummy-logo-${brand.id}.png`}
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
