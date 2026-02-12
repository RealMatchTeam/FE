import { useState, useMemo, useDeferredValue, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import FilterButton from "../../../components/common/FilterButton";
import CampaignCard from "./components/CampaignCard";
import { type CampaignCategory } from "../../../data/campaign";
import CampaignFilterBar from "./components/CampaignFilterBar";
import FilterBottomSheet from "../../../components/common/FilterBottomSheet";
import MatchingFilter from "../components/MatchingFilter";
import { useHideBottomTab } from "../../../hooks/useHideBottomTab";
import EmptyMatchState from "../../../components/common/EmptyMatchState";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { getMatchingCampaigns, getTagNamesByCategory, toggleCampaignLike, type MatchingCampaign } from "../api/matching";

export default function CampaignContent() {
    const [searchParams] = useSearchParams();
    const category = (searchParams.get("type") || "BEAUTY") as CampaignCategory;
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { ref, inView } = useInView();

    // 필터 상태
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortOption, setSortOption] = useState("매칭률 순");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // 검색 상태
    const [searchKeyword, setSearchKeyword] = useState("");
    const deferredKeyword = useDeferredValue(searchKeyword);

    // 정렬 옵션 매핑
    const sortByMap: Record<string, string> = {
        "정렬 필터": "MATCH_SCORE",
        "매칭률 순": "MATCH_SCORE",
        "인기 순": "POPULARITY",
        "금액 순": "REWARD_AMOUNT",
        "마감 순": "D_DAY",
    };
    const sortBy = sortByMap[sortOption] || "MATCH_SCORE";

    // 데이터 페칭
    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ["matching-campaigns", category, sortOption, selectedTags, deferredKeyword],
        queryFn: async ({ pageParam = 0 }) => {
            const tagsToSend = selectedTags.length > 0 ? selectedTags : await getTagNamesByCategory();
            const response = await getMatchingCampaigns(
                sortBy,
                category,
                tagsToSend,
                deferredKeyword || undefined,
                pageParam,
                20
            );
            return response;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const nextParam = allPages.length;
            // 총 아이템 수보다 현재 가져온 아이템 수가 적으면 다음 페이지 호출
            const currentTotal = allPages.reduce((acc, page) => acc + page.campaigns.length, 0);
            return currentTotal < lastPage.count ? nextParam : undefined;
        },
        staleTime: 1000 * 60 * 1, // 1분간 캐시 유지
    });

    // 무한 스크롤 트리거
    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    const campaigns = useMemo(() => {
        return data?.pages.flatMap(page => page.campaigns) || [];
    }, [data]);

    // 바텀탭 숨기기
    useHideBottomTab(isFilterOpen);

    const handleCategoryChange = (newCategory: CampaignCategory) => {
        navigate(`/matching/campaign?type=${newCategory}`);
    };

    const toggleLike = async (id: number) => {
        const queryKey = ["matching-campaigns", category, sortOption, selectedTags, deferredKeyword];

        // 낙관적 업데이트
        queryClient.setQueryData(queryKey, (oldData: { pages: { campaigns: MatchingCampaign[] }[] } | undefined) => {
            if (!oldData) return oldData;
            return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                    ...page,
                    campaigns: page.campaigns.map((campaign) =>
                        campaign.id === id ? { ...campaign, isLiked: !campaign.isLiked } : campaign
                    )
                }))
            };
        });

        try {
            await toggleCampaignLike(id);
        } catch (error) {
            console.error("캠페인 좋아요 토글 실패:", error);
            // 실패 시 롤백
            queryClient.setQueryData(queryKey, (oldData: { pages: { campaigns: MatchingCampaign[] }[] } | undefined) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        campaigns: page.campaigns.map((campaign) =>
                            campaign.id === id ? { ...campaign, isLiked: !campaign.isLiked } : campaign
                        )
                    }))
                };
            });
        }
    };

    const handleFilterApply = (sort: string, tags: string[]) => {
        setSortOption(sort);
        setSelectedTags(tags);
    };



    const getFilterButtonLabel = () => {
        if (selectedTags.length > 0) {
            return selectedTags.slice(0, 2).join(", ") + (selectedTags.length > 2 ? "..." : "");
        }
        return "콘텐츠 필터";
    };

    // 로딩 중
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full" style={{ background: "linear-gradient(180deg, #F6F6FF 0%, #F3F3FA 48.08%, #E8E8FB 100%)" }}>
                <LoadingSpinner />
            </div>
        );
    }

    // 매칭 결과가 없거나 에러
    if (error || (campaigns.length === 0 && !isLoading)) {
        if (error) console.error("Failed to fetch matching campaigns:", error);

        return <EmptyMatchState
            message={`매칭된 기업이 없어요\n매칭 검사를 먼저 진행해주세요`}
            showButton={true}
            buttonText="매칭 검사하기"
            contentClassName="pb-14"
        />
    }

    // 매칭 결과가 있을 때
    return (
        <div className="flex flex-col h-full" style={{ background: "linear-gradient(180deg, #F6F6FF 0%, #F3F3FA 48.08%, #E8E8FB 100%)" }}>
            {/* 뷰티/패션 필터 & 검색창 */}
            <CampaignFilterBar
                category={category}
                onCategoryChange={handleCategoryChange}
                searchKeyword={searchKeyword}
                onSearchChange={setSearchKeyword}
            />

            {/* 메인 컨텐츠 */}
            <div className="flex-1 px-4 py-6 overflow-y-auto">
                {/* 타이틀 & 필터 */}
                <div className="mb-4">
                    <h2 className="text-title1 mb-4">캠페인 리스트</h2>
                    <div className="flex gap-2">
                        <FilterButton
                            label={sortOption}
                            isActive={true}
                            onClick={() => setIsFilterOpen(true)}
                        />
                        <FilterButton
                            label={getFilterButtonLabel()}
                            isActive={selectedTags.length > 0}
                            onClick={() => setIsFilterOpen(true)}
                        />
                    </div>
                </div>

                {/* 캠페인 리스트 */}
                <div className="space-y-3 pb-20">
                    {campaigns.map((campaign) => (
                        <CampaignCard
                            key={campaign.id}
                            brandName={campaign.brandName}
                            title={campaign.campaignName || campaign.title || "캠페인"}
                            reward={campaign.manuscriptFee || campaign.reward || 0}
                            matchRate={campaign.matchingRatio || campaign.matchRate || 0}
                            applicants={campaign.applicants}
                            isLiked={campaign.isLiked}
                            onLike={() => toggleLike(campaign.id)}
                            onClick={() => navigate(`/campaign?campaignId=${campaign.id}&brandId=${campaign.brandId}&domain=${category.toLowerCase()}&matchRate=${campaign.matchingRatio || campaign.matchRate || 0}`)}
                            logoUrl={campaign.logoUrl || `/dummy-logo-${campaign.id}.png`}
                            dDay={campaign.dDay}
                        />
                    ))}

                    {/* 무한 스크롤 트리거 & 로딩 */}
                    <div ref={ref} className="h-10 flex items-center justify-center">
                        {isFetchingNextPage && <LoadingSpinner className="py-4" size={80} />}
                    </div>
                </div>
            </div>

            {/* 필터 바텀시트 */}
            <FilterBottomSheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
                <MatchingFilter
                    filterType="CONTENT"
                    selectedSort={sortOption}
                    selectedTags={selectedTags}
                    onApply={handleFilterApply}
                    onClose={() => setIsFilterOpen(false)}
                />
            </FilterBottomSheet>
        </div>
    );
}
