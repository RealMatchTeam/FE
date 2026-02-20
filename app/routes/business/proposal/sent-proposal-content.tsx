import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getProposalDetail, type ProposalDetail } from "./api/proposal";
import { getBrandSummary, type BrandSummary } from "./api/brand";
import { getProfileCard, type ProfileCard } from "./api/user";
import { cancelCampaignProposal } from "./api/proposal";
import { useHideHeader } from "../../../hooks/useHideHeader";

import NavigationHeader from "../../../components/common/NavigateHeader";
import CampaignBrandCard from "../components/CampaignBrandCard";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import CampaignInfoGroup from "../components/CampaignInfoGroup";

import dropdownIcon from "../../../assets/arrow-down.svg";
import dropupIcon from "../../../assets/arrow-up.svg";
import arrowRightIcon from "../../../assets/icon/arrow-right.svg";
import arrowPurpleIcon from "../../../assets/arrow-purple.svg";
import profileIcon from "../../../assets/icon-profile.svg";
import ConfirmModal from "../../../components/common/ConfirmModal";
import adRealmatchLogo from "../../../assets/ad/ad-realmatch-logo.png";

export default function ProposalContent() {
    const [searchParams] = useSearchParams();
    const [isContentOpen, setIsContentOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const navigate = useNavigate();
    useHideHeader(true);

    const [data, setData] = useState<ProposalDetail | null>(null);
    const [brand, setBrand] = useState<BrandSummary | null>(null);
    const [profileCard, setProfileCard] = useState<ProfileCard | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const proposalId = searchParams.get("proposalId");

    useHideHeader(true);

    const STATUS_TEXT_MAP: Record<string, string> = {
        REVIEWING: "검토 중",
        MATCHED: "매칭 완료",
        REJECTED: "거절됨",
        CANCELED: "취소됨",
    };

    useEffect(() => {
        if (!proposalId) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            console.log("실제 넘길 ID:", proposalId);
            try {
                setIsLoading(true);
                const proposalResult = await getProposalDetail(proposalId);
                setData(proposalResult);

                if (proposalResult.brandId === 0) {
                    // brandId가 0이면 리얼매치 광고로 하드코딩
                    setBrand({
                        brandId: 0,
                        brandName: "리얼매치",
                        brandTags: ["정밀매칭", "원스톱협업", "쌍방향제안"],
                        brandImageUrl: adRealmatchLogo,
                        matchingRate: 0
                    });
                } else if (proposalResult.brandId) {
                    const brandResult = await getBrandSummary(proposalResult.brandId);
                    setBrand(brandResult);
                }

                const profileResult = await getProfileCard();
                setProfileCard(profileResult);


            } catch (error) {
                console.error("제안 상세 조회 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [proposalId]);

    if (isLoading) return <LoadingSpinner className="py-10" />;
    if (!data) return <div className="p-10 text-center">데이터를 찾을 수 없습니다.</div>;

    const getTagNames = (tags: { name: string }[]) => tags.map(t => t.name).join(", ");

    const handleCancelSubmit = async () => {
        if (!proposalId) return;

        try {
            const response = await cancelCampaignProposal(proposalId);
            if (response.isSuccess) {
                // 성공 시 모달 닫고 바로 이전 페이지로 이동
                setIsConfirmOpen(false);
                navigate(-1);
            }
        } catch (error) {
            console.error("제안 취소 실패:", error);
            setIsConfirmOpen(false);
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-bg-w font-pretendard">
            <NavigationHeader title="제안 보기" onBack={() => navigate(-1)} />

            <main className="flex flex-col pb-24">
                {/* 브랜드 카드 및 제안 프로필 */}
                <div className="px-4 py-6">
                    <CampaignBrandCard
                        showChatSection={false}
                        statusText={STATUS_TEXT_MAP[data.status] || data.status}
                        brandName={brand?.brandName}
                        brandTags={brand?.brandTags || []}
                        brandImageUrl={brand?.brandImageUrl}
                        matchingRate={brand?.matchingRate}
                        brandId={brand?.brandId || data.brandId}
                        category={data.contentTags.categories[0]?.name || "beauty"}
                    />

                    <div className="flex flex-col gap-4">
                        <h2 className="text-title1 text-text-black">{data.title}</h2>

                        <div className="flex flex-col gap-2">
                            <p className="text-title3 text-text-gray2">제안 프로필</p>

                            <div
                                onClick={() => navigate("/mypage/profileCard")}
                                className="w-full p-4 bg-bluegray-2 rounded-2xl flex justify-between items-center border border-core-70 cursor-pointer active:scale-[0.98] transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center">
                                        <img src={profileIcon} alt="profile" />
                                    </div>
                                    <span className="text-callout1 text-text-black">
                                        @{profileCard?.snsAccount || "unknown"}
                                    </span>
                                </div>
                                <img src={arrowPurpleIcon} alt="arrow" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 상세 정보 섹션 */}
                <div className="bg-bluegray-1 px-4 py-8 flex flex-col gap-6">
                    {/* 캠페인명 */}
                    <CampaignInfoGroup label="캠페인명">
                        <div className="w-full p-4 bg-bg-w border border-text-gray5 rounded-xl text-body1 text-text-gray1">
                            {data.title}
                        </div>
                    </CampaignInfoGroup>

                    {/* 캠페인 내용 */}
                    <CampaignInfoGroup
                        label="캠페인 내용"
                        right={
                            <button onClick={() => setIsContentOpen(prev => !prev)}>
                                <img
                                    src={isContentOpen ? dropupIcon : dropdownIcon}
                                    alt="toggle"
                                    className="w-5 h-5"
                                />
                            </button>
                        }
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <p className="text-caption2 text-text-gray3">설명</p>
                                <div className="w-full p-4 bg-bg-w border border-text-gray5 rounded-xl text-body1 leading-relaxed text-text-gray1">
                                    {data.description}
                                </div>
                            </div>

                            {/* 아코디언 상세 내용 */}
                            {isContentOpen && (
                                <div className="grid grid-cols-2 gap-4 animate-slide-up">
                                    <div className="col-span-2">
                                        <ContentItem label="형식" value={getTagNames(data.contentTags.formats)} />
                                    </div>
                                    <ContentItem label="종류" value={getTagNames(data.contentTags.categories)} />
                                    <ContentItem label="톤" value={getTagNames(data.contentTags.tones)} />
                                    <ContentItem label="관여도" value={getTagNames(data.contentTags.involvements)} />
                                    <ContentItem label="활용 범위" value={getTagNames(data.contentTags.usageRanges)} />
                                </div>
                            )}
                        </div>
                    </CampaignInfoGroup>

                    {/* 협찬품 / 원고료 */}
                    <div className="grid grid-cols-2 gap-4">
                        <CampaignInfoGroup label="협찬품">
                            <div className="w-full p-4 bg-bg-w border border-text-gray5 rounded-xl text-body1 flex justify-between items-center text-text-gray1">
                                <span className="truncate">{data.productId !== 0 ? data.productId : ""}</span>
                                <img src={arrowRightIcon} alt="arrow" className="w-4 h-4 opacity-30" />
                            </div>
                        </CampaignInfoGroup>

                        <CampaignInfoGroup label="원고료">
                            <div className="w-full p-4 bg-bg-w border border-text-gray5 rounded-xl text-body1 flex justify-between items-center text-text-gray1">
                                {data.rewardAmount.toLocaleString()} <span className="text-text-black">원</span>
                            </div>
                        </CampaignInfoGroup>
                    </div>

                    {/* 제작 기간 */}
                    <CampaignInfoGroup label="제작 기간">
                        <div className="flex items-center gap-2 text-text-gray1">
                            <div className="flex-1 p-4 bg-bg-w border border-text-gray5 rounded-xl text-body1">
                                {(data?.startDate || "").replace(/-/g, '. ')}
                            </div>
                            <span className="text-text-gray3">~</span>
                            <div className="flex-1 p-4 bg-bg-w border border-text-gray5 rounded-xl text-body1">
                                {(data?.endDate || "").replace(/-/g, '. ')}
                            </div>
                        </div>
                    </CampaignInfoGroup>
                </div>

                <div className="px-4 py-5 flex justify-end bg-bg-w">
                    {/* 상태가 REVIEWING일 때만 취소 버튼 */}
                    {data.status === "REVIEWING" && (
                        <button
                            onClick={() => setIsConfirmOpen(true)}
                            className="px-4 py-2 bg-bg-w border border-core-3 rounded-xl text-core-1 text-title3 hover:bg-bluegray-1 transition-colors"
                        >
                            취소하기
                        </button>
                    )}
                </div>

                <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleCancelSubmit}
                title="제안을 취소하시겠습니까?"
            />

                
            </main>
        </div>
    );
}

function ContentItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <p className="text-caption2 text-text-gray3">{label}</p>
            <div className="p-4 bg-bg-w border border-text-gray5 rounded-xl text-body1 flex justify-between items-center text-text-gray1">
                <span className="truncate">{value}</span>
                <img src={arrowRightIcon} alt="arrow" className="w-4 h-4 opacity-30" />
            </div>
        </div>
    );
}
