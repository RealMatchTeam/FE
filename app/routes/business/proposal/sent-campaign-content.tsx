import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getProposalDetail, type ProposalDetail } from "./api/proposal";
import { getBrandSummary, type BrandSummary } from "./api/brand";
import Header from "../../../components/layout/Header";
import CampaignBrandCard from "../components/CampaignBrandCard";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import CampaignInfoGroup from "../components/CampaignInfoGroup";

import dropdownIcon from "../../../assets/arrow-down.svg";
import dropupIcon from "../../../assets/arrow-up.svg";
import arrowRightIcon from "../../../assets/icon/arrow-right.svg";
import chatIcon from "../../../assets/icon/icon-chat.svg"; // 채팅 아이콘 추가 필요

export default function SentCampaignContent() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isContentOpen, setIsContentOpen] = useState(false);

    const [data, setData] = useState<ProposalDetail | null>(null);
    const [brand, setBrand] = useState<BrandSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const proposalId = searchParams.get("proposalId");

    useEffect(() => {
        if (!proposalId) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const proposalResult = await getProposalDetail(proposalId);
                setData(proposalResult);

                if (proposalResult.brandId) {
                    const brandResult = await getBrandSummary(proposalResult.brandId);
                    setBrand(brandResult);
                }
            } catch (error) {
                console.error("캠페인 상세 조회 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [proposalId]);

    if (isLoading) return <LoadingSpinner className="py-10" />;
    if (!data) return <div className="p-10 text-center">데이터를 찾을 수 없습니다.</div>;

    const getTagNames = (tags: { name: string }[]) => tags.map(t => t.name).join(", ");

    return (
        <div className="flex flex-col w-full min-h-screen bg-bg-w font-pretendard">
            <Header title="캠페인 보기" />

            <main className="flex flex-col pb-24">
                {/* 상단 브랜드 정보 및 채팅 섹션 */}
                <div className="px-4 py-6 flex flex-col gap-6">
                    <CampaignBrandCard
                        showChatSection={false}
                        statusText="보낸 제안"
                        brandName={brand?.brandName}
                        brandTags={brand?.brandTags || []}
                        brandImageUrl={brand?.brandImageUrl}
                    />

                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <span className="text-core-1 text-title3">신규 캠페인</span>
                            <h2 className="text-title1 text-text-black">{data.title}</h2>
                        </div>
                        {/* 채팅하기 버튼 */}
                        <button 
                            onClick={() => navigate(`/chat/${data.brandId}`)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-bluegray-2 rounded-lg text-text-gray1 text-caption1 active:bg-bluegray-3 transition-colors"
                        >
                            <img src={chatIcon} alt="chat" className="w-4 h-4" />
                            채팅하기
                        </button>
                    </div>
                </div>

                {/* 캠페인 상세 정보 영역 */}
                <div className="bg-bluegray-1 px-4 py-8 flex flex-col gap-6">
                    {/* 캠페인명 (수정 아이콘 포함 UI) */}
                    <CampaignInfoGroup 
                        label="캠페인명" 
                        right={<img src={arrowRightIcon} alt="edit" className="w-4 h-4 opacity-40 rotate-[-45deg]" />}
                    >
                        <div className="w-full p-4 bg-bg-w border border-text-gray5 rounded-xl text-body1 text-text-gray1">
                            {data.title}
                        </div>
                    </CampaignInfoGroup>

                    {/* 캠페인 내용 (아코디언) */}
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
                                <span className="truncate">{data.productId}</span>
                                <img src={arrowRightIcon} alt="arrow" className="w-4 h-4 opacity-30" />
                            </div>
                        </CampaignInfoGroup>

                        <CampaignInfoGroup label="원고료">
                            <div className="w-full p-4 bg-bg-w border border-text-gray5 rounded-xl text-body1 flex justify-between items-center text-text-gray1">
                                {data.rewardAmount.toLocaleString()} <span className="ml-1 text-text-black">원</span>
                            </div>
                        </CampaignInfoGroup>
                    </div>

                    {/* 제작 기간 */}
                    <CampaignInfoGroup label="제작 기간">
                        <div className="flex items-center gap-2 text-text-gray1">
                            <div className="flex-1 p-4 bg-bg-w border border-text-gray5 rounded-xl text-body1 flex justify-between items-center">
                                <span>{(data?.startDate || "").replace(/-/g, '. ')}</span>
                                <img src={arrowRightIcon} alt="calendar" className="w-4 h-4 opacity-30" />
                            </div>
                            <span className="text-text-gray3">~</span>
                            <div className="flex-1 p-4 bg-bg-w border border-text-gray5 rounded-xl text-body1 flex justify-between items-center">
                                <span>{(data?.endDate || "").replace(/-/g, '. ')}</span>
                                <img src={arrowRightIcon} alt="calendar" className="w-4 h-4 opacity-30" />
                            </div>
                        </div>
                    </CampaignInfoGroup>

                    {/* 기타 협의 사항 (추가된 부분) */}
                    <CampaignInfoGroup 
                        label="기타 협의 사항"
                        right={<img src={arrowRightIcon} alt="edit" className="w-4 h-4 opacity-40 rotate-[-45deg]" />}
                    >
                        <div className="w-full p-4 bg-bg-w border border-text-gray5 rounded-xl min-h-[54px]">
                            {/* 데이터에 기타 협의 사항 필드가 있다면 출력 */}
                            <p className="text-body1 text-text-gray1">
                                {data.description ? "협의된 내용이 없습니다." : ""} 
                            </p>
                        </div>
                    </CampaignInfoGroup>
                </div>
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