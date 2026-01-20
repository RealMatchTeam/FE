import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import FilterButton from "../../../../components/common/FilterButton";
import CampaignCard from "./components/CampaignCard";
import { CAMPAIGN_DATA, type CampaignCategory } from "../../../../data/campaign";
import CampaignFilterBar from "./components/CampaignFilterBar";
import { Route } from "./route";
import FilterBottomSheet from "../../../../components/common/FilterBottomSheet";
import MatchingFilter from "../components/MatchingFilter";


export default function CampaignContent() {
    const { type: category = "BEAUTY" } = Route.useSearch();
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState(CAMPAIGN_DATA);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortOption, setSortOption] = useState("정렬 필터");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleCategoryChange = (newCategory: CampaignCategory) => {
        navigate({
            to: "/matching/campaign",
            search: { type: newCategory },
        });
    };

    // 카테고리별 필터링
    const filteredCampaigns = useMemo(() => {
        return campaigns.filter(campaign => campaign.category === category);
    }, [campaigns, category]);

    const toggleLike = (id: number) => {
        setCampaigns(prev => prev.map(campaign =>
            campaign.id === id ? { ...campaign, isLiked: !campaign.isLiked } : campaign
        ));
    };

    const handleFilterApply = (sort: string, tags: string[]) => {
        setSortOption(sort);
        setSelectedTags(tags);
        // TODO: 정렬 및 태그 필터 적용 로직
    };

    // 필터 버튼 라벨 생성
    const getSortButtonLabel = () => {
        return sortOption;
    };

    const getFilterButtonLabel = () => {
        if (selectedTags.length > 0) {
            return selectedTags.slice(0, 2).join(", ") + (selectedTags.length > 2 ? "..." : "");
        }
        return "콘텐츠 필터";
    };

    return (
        <div className="flex flex-col h-full bg-core-2">
            {/* 뷰티/패션 필터 & 검색창 */}
            <CampaignFilterBar category={category} onCategoryChange={handleCategoryChange} />

            {/* 메인 컨텐츠 */}
            <div className="flex-1 px-4 py-6 overflow-y-auto">
                {/* 타이틀 & 필터 */}
                <div className="mb-4">
                    <h2 className="text-title1 mb-3">캠페인 리스트</h2>
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

                {/* 캠페인 리스트 */}
                <div className="space-y-3 pb-20">
                    {filteredCampaigns.map((campaign) => (
                        <CampaignCard
                            key={campaign.id}
                            brandName={campaign.brandName}
                            title={campaign.title}
                            reward={campaign.reward}
                            matchRate={campaign.matchRate}
                            applicants={campaign.applicants}
                            isLiked={campaign.isLiked}
                            onLike={() => toggleLike(campaign.id)}
                            logoUrl={`/dummy-logo-${campaign.id}.png`}
                        />
                    ))}
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
