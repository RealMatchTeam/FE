import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../../../components/layout/Header";

import CampaignBrandCard from "../components/CampaignBrandCard";
import CampaignInfoGroup from "../components/CampaignInfoGroup";
//import Modal from "../../../components/common/Modal";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

import { getProposalDetail, type ProposalDetail } from "./api/proposal";
import { getBrandSummary, type BrandSummary } from "./api/brand";

import dropdownIcon from "../../../assets/arrow-down.svg";
import dropupIcon from "../../../assets/arrow-up.svg";
import arrowRightIcon from "../../../assets/icon/arrow-right.svg";
import chatIcon from "../../../assets/icon/icon-chat.svg";
//import checkIcon from "../../../assets/icon/icon-check-circle.svg";
//import closeIcon from "../../../assets/icon/icon-close.svg";

interface TagItem {
    name: string;
    [key: string]: any; // 다른 속성이 있을 수 있음을 허용하거나 필요한 속성만 정의
}


export default function ReceivedCampaignContent() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const proposalId = searchParams.get("id") || searchParams.get("proposalId");

    const [proposal, setProposal] = useState<ProposalDetail | null>(null);
    const [brand, setBrand] = useState<BrandSummary | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    //const [modalType, setModalType] = useState<"none" | "confirm" | "success" | "reject" | "rejectSuccess">("none");
    const [isContentOpen, setIsContentOpen] = useState(false);
    //const [isProcessing, setIsProcessing] = useState(false);
    //const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (!proposalId) return;
            try {
                setIsLoading(true);
                const proposalResult = await getProposalDetail(proposalId);
                setProposal(proposalResult);

                if (proposalResult.brandId) {
                    const brandResult = await getBrandSummary(proposalResult.brandId);
                    setBrand(brandResult);
                }
            } catch (error) {
                console.error("데이터 로드 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [proposalId]);

    // 수락/거절 핸들러 (기존 로직 유지)
    //const handleAcceptClick = () => setModalType("confirm");
    //const handleRejectClick = () => setModalType("reject");
    //const closeModal = () => { setModalType("none"); setRejectReason(""); };

    /*const handleConfirm = async () => {
        if (!proposalId) return;
        try {
            setIsProcessing(true);
            const response = await approveCampaignProposal(proposalId);
            if (response.isSuccess) setModalType("success");
        } catch (error) {
            alert("처리 중 에러가 발생했습니다.");
        } finally { setIsProcessing(false); }
    };

    const handleRejectSubmit = async () => {
        if (!proposalId) return;
        try {
            setIsProcessing(true);
            const response = await rejectCampaignProposal(proposalId, rejectReason);
            if (response.isSuccess) setModalType("rejectSuccess");
        } catch (error) {
            alert("처리 중 에러가 발생했습니다.");
        } finally { setIsProcessing(false); }
    };*/

    const formatTags = (tags: TagItem[] | undefined | null) => 
        (!tags || tags.length === 0 ? "정보 없음" : tags.map((t: TagItem) => t.name).join(", "));
    const formatDate = (dateStr: string) => (dateStr || "").replace(/-/g, ". ");

    if (isLoading) return <LoadingSpinner className="py-10" />;
    if (!proposal) return <div className="p-10 text-center text-text-gray3">데이터를 찾을 수 없습니다.</div>;

    return (
        <div className="flex flex-col w-full min-h-screen bg-[var(--color-bg-w)] font-pretendard relative">
            <Header title="캠페인 보기" showBack={true} />

            <main className="flex flex-col pb-24 bg-[var(--color-bluegray-1)]">
                {/* 1. 상단 브랜드 정보 및 채팅 섹션 */}
                <div className="bg-[var(--color-bg-w)] px-4 py-6 flex flex-col gap-6">
                    <CampaignBrandCard
                        showChatSection={false}
                        statusText="받은 제안"
                        brandName={brand?.brandName}
                        brandTags={brand?.brandTags}
                        brandImageUrl={brand?.brandImageUrl}
                        matchingRate={brand?.matchingRate}
                    />

                    <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <span className="text-core-1 text-title3">신규 캠페인</span>
                            <h2 className="text-title1 text-text-black">{proposal.title}</h2>
                        </div>
                        <button 
                            onClick={() => navigate(`/chat/${proposal.brandId}`)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-bluegray-2 rounded-lg text-text-gray1 text-caption1 active:bg-bluegray-3 transition-colors"
                        >
                            <img src={chatIcon} alt="chat" className="w-4 h-4" />
                            채팅하기
                        </button>
                    </div>
                </div>

                {/* 2. 캠페인 상세 정보 섹션 */}
                <div className="px-4 py-8 flex flex-col gap-6">
                    {/* 캠페인 내용 (아코디언) */}
                    <CampaignInfoGroup
                        label="캠페인 내용"
                        right={
                            <button onClick={() => setIsContentOpen((prev) => !prev)}>
                                <img src={isContentOpen ? dropupIcon : dropdownIcon} alt="toggle" className="w-5 h-5" />
                            </button>
                        }
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <p className="text-callout1 text-[var(--color-text-gray2)]">설명</p>
                                <div className="w-full min-h-[68px] px-4 py-2.5 bg-bg-w border border-text-gray5 rounded-lg text-callout1 text-text-gray1 leading-relaxed">
                                    {proposal.description}
                                </div>
                            </div>

                            {isContentOpen && (
                                <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
                                    <div className="col-span-2">
                                        <ContentItem label="형식" value={formatTags(proposal.contentTags.formats)} />
                                    </div>
                                    <ContentItem label="종류" value={formatTags(proposal.contentTags.categories)} />
                                    <ContentItem label="톤" value={formatTags(proposal.contentTags.tones)} />
                                    <ContentItem label="관여도" value={formatTags(proposal.contentTags.involvements)} />
                                    <ContentItem label="활용 범위" value={formatTags(proposal.contentTags.usageRanges)} />
                                </div>
                            )}
                        </div>
                    </CampaignInfoGroup>

                    {/* 협찬품 / 원고료 */}
                    <div className="grid grid-cols-2 gap-4">
                        <CampaignInfoGroup label="협찬품">
                            <div className="w-full h-9 px-4 bg-bg-w border border-text-gray5 rounded-lg text-callout1 text-text-gray1 flex justify-between items-center">
                                <span className="truncate">네이처 스크럽 바 1개</span>
                                <img src={arrowRightIcon} alt="arrow" className="w-4 h-4 opacity-30" />
                            </div>
                        </CampaignInfoGroup>

                        <CampaignInfoGroup label="원고료">
                            <div className="w-full h-9 px-4 bg-bg-w border border-text-gray5 rounded-lg text-callout1 text-text-gray1 flex justify-between items-center">
                                <span>{proposal.rewardAmount.toLocaleString()}</span>
                                <span className="ml-1">원</span>
                            </div>
                        </CampaignInfoGroup>
                    </div>

                    {/* 제작 기간 */}
                    <CampaignInfoGroup label="제작 기간">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-9 px-4 flex items-center bg-bg-w border border-text-gray5 rounded-lg text-callout1 text-text-gray1">
                                {formatDate(proposal?.startDate || "")}
                            </div>
                            <span className="text-text-gray3">~</span>
                            <div className="flex-1 h-9 px-4 flex items-center bg-bg-w border border-text-gray5 rounded-lg text-callout1 text-text-gray1">
                                {formatDate(proposal?.endDate || "")}
                            </div>
                        </div>
                    </CampaignInfoGroup>

                    {/* 기타 협의 사항 */}
                    <CampaignInfoGroup 
                        label="기타 협의 사항"
                        right={<img src={arrowRightIcon} alt="edit" className="w-4 h-4 opacity-40 rotate-[-45deg]" />}
                    >
                        <div className="w-full h-10 px-4 bg-bg-w border border-text-gray5 rounded-lg"></div>
                    </CampaignInfoGroup>
                </div>
            </main>
        </div>
    );
}

function ContentItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-callout1 text-text-gray2">{label}</p>
            <div className="w-full h-9 flex justify-between items-center bg-bg-w border border-text-gray5 rounded-lg">
                <span className="flex-1 truncate pl-4 text-callout1 text-text-gray1">{value}</span>
                <img src={arrowRightIcon} alt="arrow" className="w-4 h-4 mr-3 opacity-30" />
            </div>
        </div>
    );
}