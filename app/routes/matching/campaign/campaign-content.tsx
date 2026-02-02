import { useState, useMemo, useDeferredValue, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import FilterButton from "../../../components/common/FilterButton";
import CampaignCard from "./components/CampaignCard";
import { type CampaignCategory } from "../../../data/campaign";
import CampaignFilterBar from "./components/CampaignFilterBar";
import FilterBottomSheet from "../../../components/common/FilterBottomSheet";
import MatchingFilter from "../components/MatchingFilter";
import { useHideBottomTab } from "../../../hooks/useHideBottomTab";
import MainIcon from "../../../assets/MainIcon.svg";
import MiniLogo from "../../../assets/logo/mini-logo.svg";
import Button from "../../../components/common/Button";
import { getMatchingCampaigns, getTagNamesByCategory, type MatchingCampaign } from "../api/matching";

export default function CampaignContent() {
    const [searchParams] = useSearchParams();
    const category = (searchParams.get("type") || "BEAUTY") as CampaignCategory;
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState<MatchingCampaign[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortOption, setSortOption] = useState("정렬 필터");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const deferredKeyword = useDeferredValue(searchKeyword);
    const [hasMatchingResult, setHasMatchingResult] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // API 호출해서 매칭 결과 가져오기
    useEffect(() => {
        const fetchMatchingCampaigns = async () => {
            try {
                const categoryTags = await getTagNamesByCategory(category);
                const campaigns = await getMatchingCampaigns("MATCH_SCORE", category, categoryTags);

                if (campaigns && campaigns.length > 0) {
                    setCampaigns(campaigns);
                    setHasMatchingResult(true);
                } else {
                    setHasMatchingResult(false);
                }
            } catch (error) {
                console.error("Failed to fetch matching campaigns:", error);
                setHasMatchingResult(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMatchingCampaigns();
    }, [category]);

    // 바텀탭 숨기기
    useHideBottomTab(isFilterOpen);

    const handleCategoryChange = (newCategory: CampaignCategory) => {
        navigate(`/matching/campaign?type=${newCategory}`);
    };

    // 카테고리 + 검색어 필터링
    const filteredCampaigns = useMemo(() => {
        return campaigns.filter(campaign => {
            const matchesCategory = campaign.category === category;
            const campaignTitle = campaign.title || campaign.name || "";
            const matchesSearch = deferredKeyword === "" ||
                campaignTitle.toLowerCase().includes(deferredKeyword.toLowerCase()) ||
                campaign.brandName.toLowerCase().includes(deferredKeyword.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [campaigns, category, deferredKeyword]);

    const toggleLike = (id: number) => {
        setCampaigns(prev => prev.map(campaign =>
            campaign.id === id ? { ...campaign, isLiked: !campaign.isLiked } : campaign
        ));
    };

    const handleFilterApply = async (sort: string, tags: string[]) => {
        setSortOption(sort);
        setSelectedTags(tags);

        // 정렬 및 태그 필터 적용하여 캠페인 목록 재조회
        try {
            setIsLoading(true);

            // sortBy 변환 (UI 라벨 -> API 파라미터)
            const sortByMap: Record<string, string> = {
                "정렬 필터": "MATCH_SCORE",
                "매칭률 순": "MATCH_SCORE",
                "인기 순": "POPULARITY",
                "금액 순": "FEE",
                "마감 순": "DEADLINE",
            };
            const sortBy = sortByMap[sort] || "MATCH_SCORE";

            const tagsToSend = tags.length > 0 ? tags : await getTagNamesByCategory(category);

            const campaigns = await getMatchingCampaigns(sortBy, category, tagsToSend);

            if (campaigns && campaigns.length > 0) {
                setCampaigns(campaigns);
            }
        } catch (error) {
            console.error("Failed to apply filters:", error);
        } finally {
            setIsLoading(false);
        }
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
                            title={campaign.name || campaign.title || "캠페인"}
                            reward={campaign.manuscriptFee || campaign.reward || 0}
                            matchRate={campaign.matchingRatio || campaign.matchRate || 0}
                            applicants={campaign.applicants}
                            isLiked={campaign.isLiked}
                            onLike={() => toggleLike(campaign.id)}
                            logoUrl={campaign.logoUrl || `/dummy-logo-${campaign.id}.png`}
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
