import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useHideHeader } from "../../../hooks/useHideHeader";
import NavigationHeader from "../../../components/common/NavigateHeader";

import CampaignBrandCard from "../components/CampaignBrandCard";
import CampaignInfoGroup from "../components/CampaignInfoGroup";
import Modal from "../../../components/common/Modal";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

import { getProposalDetail, approveCampaignProposal, rejectCampaignProposal, type ProposalDetail } from "./api/proposal";
import { getBrandSummary, type BrandSummary } from "./api/brand";

import dropdownIcon from "../../../assets/arrow-down.svg";
import dropupIcon from "../../../assets/arrow-up.svg";
import arrowRightIcon from "../../../assets/icon/arrow-right.svg";
import profileIcon from "../../../assets/logo/mini-logo.svg";
import checkIcon from "../../../assets/icon/icon-check-circle.svg";
import closeIcon from "../../../assets/icon/icon-close.svg";

export default function ReceivedProposalContent() {
    const [searchParams] = useSearchParams();
    const proposalId = searchParams.get("id") || searchParams.get("proposalId");

    const [proposal, setProposal] = useState<ProposalDetail | null>(null);
    const [brand, setBrand] = useState<BrandSummary | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [modalType, setModalType] = useState<"none" | "confirm" | "success" | "reject" | "rejectSuccess">("none");
    const [isContentOpen, setIsContentOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [rejectReason, setRejectReason] = useState("");
    const navigate = useNavigate();
    useHideHeader(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!proposalId || typeof proposalId !== "string") return;
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
    }, [proposalId])

    const handleAcceptClick = () => setModalType("confirm");
    const handleConfirm = async () => {
        if (!proposalId) return;

        try {
            setIsProcessing(true);

            const response = await approveCampaignProposal(proposalId);

            if (response.isSuccess) {
                setModalType("success");

            } else {
                alert(response.message || "수락 처리 중 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("수락 연동 에러:", error);
            alert("서버와 통신 중 에러가 발생했습니다.");
        } finally {
            setIsProcessing(false);
        }
    };
    const closeModal = () => {
        setModalType("none");
        setRejectReason(""); 
    };

    const handleRejectClick = () => setModalType("reject");

    const handleRejectSubmit = async () => {
        if (!proposalId || !rejectReason.trim()) return;

        try {
            setIsProcessing(true);
            const response = await rejectCampaignProposal(proposalId, rejectReason);

            if (response.isSuccess) {
                setModalType("rejectSuccess");
            } else {
                alert(response.message || "거절 처리 중 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("거절 연동 에러:", error);
            alert("서버와 통신 중 에러가 발생했습니다.");
        } finally {
            setIsProcessing(false);
        }
    };

    const formatTags = (tags: { name: string }[] | undefined | null) => {
        if (!tags || tags.length === 0) return "정보 없음";
        return tags.map(t => t.name).join(", ");
    };

    const formatDate = (dateStr: string) => (dateStr || "").replace(/-/g, ". ");

    if (isLoading) return <LoadingSpinner className="py-10" />;
    if (!proposal) return <div className="p-10 text-center text-text-gray3 font-pretendard">데이터를 찾을 수 없습니다.</div>;

    return (
        <div className="flex flex-col w-full min-h-screen bg-[var(--color-bg-w)] font-pretendard relative">
            <div className="min-h-[60px]">
                <NavigationHeader title="제안 보기" onBack={() => navigate(-1)} />
            </div>

            <main className="flex flex-col bg-[var(--color-bluegray-1)]">
                <div className="bg-[var(--color-bg-w)] px-4 py-6 flex flex-col gap-2">
                    <CampaignBrandCard
                        showChatSection={false}
                        statusText={proposal.status === "MATCHED" ? "매칭 완료" : "검토 중"}
                        brandName={brand?.brandName}
                        brandTags={brand?.brandTags}
                        brandImageUrl={brand?.brandImageUrl}
                        matchingRate={brand?.matchingRate}
                    />
                    <div>
                        <h2 className="text-title1 text-text-black">{proposal.title}</h2>
                    </div>
                </div>

                {/* 2. 상세 정보 섹션 */}
                <div className="px-4 py-8 flex flex-col gap-6">
                    <CampaignInfoGroup label="캠페인명">
                        <div className="w-full h-[36px] px-4 flex items-center bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-[6px] text-callout1 text-[var(--color-text-gray1)]">
                            {proposal.title}
                        </div>
                    </CampaignInfoGroup>

                    {/* 캠페인 내용 */}
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
                                <div className="w-full min-h-[68px] px-[16px] py-[10px] bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-[6px] text-callout1 text-[var(--color-text-gray1)] leading-relaxed">
                                    {proposal.description}
                                </div>
                            </div>

                            {isContentOpen && (
                                <div className="grid grid-cols-2 gap-x-[11px] gap-y-4 animate-in fade-in duration-300">
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
                            <div className="w-full h-[36px] px-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-[6px] text-callout1 text-[var(--color-text-gray1)] flex justify-between items-center">
                                <span className="truncate">협찬품 확인</span>
                                <img src={arrowRightIcon} alt="arrow" className="w-4 h-4 opacity-30" />
                            </div>
                        </CampaignInfoGroup>

                        <CampaignInfoGroup label="원고료">
                            <div className="w-full h-[36px] px-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-[6px] text-callout1 text-[var(--color-text-gray1)] flex justify-between items-center">
                                <span>{proposal.rewardAmount.toLocaleString()}</span>
                                <span className="shrink-0 ml-1">원</span>
                            </div>
                        </CampaignInfoGroup>
                    </div>

                    {/* 제작 기간 */}
                    <CampaignInfoGroup label="제작 기간">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-[36px] flex items-center pl-[16px] bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-[6px] text-callout1 text-[var(--color-text-gray1)]">
                                {formatDate(proposal?.startDate || "")}
                            </div>
                            <span className="text-[var(--color-text-gray3)] text-date-separator">~</span>
                            <div className="flex-1 h-[36px] flex items-center pl-[16px] bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-[6px] text-callout1 text-[var(--color-text-gray1)]">
                                {formatDate(proposal?.startDate || "")}
                            </div>
                        </div>
                    </CampaignInfoGroup>
                </div>
            </main>

            {/* 하단 고정 버튼 영역 */}
            <div className="px-4 py-5 flex gap-3 bg-[var(--color-bg-w)] sticky bottom-0 border-t border-[var(--color-text-gray5)]">
                <button
                    onClick={handleRejectClick}
                    disabled={isProcessing}
                    className="flex-1 h-[52px] bg-[var(--color-bg-w)] border border-[var(--color-core-3)] rounded-xl text-core-1 text-title3 active:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    {isProcessing ? "처리 중" : "거절하기"}
                </button>
                <button
                    onClick={handleAcceptClick}
                    className="flex-[2.5] h-[52px] bg-core-1 rounded-xl text-white text-title3 flex items-center justify-center gap-2 active:opacity-90 transition-opacity"
                >
                    <img src={profileIcon} alt="logo" className="w-6 h-6 invert brightness-0" />
                    <span>제안 수락하기</span>
                </button>
            </div>

            <Modal isOpen={modalType !== "none"} onClose={closeModal} className="w-full max-w-[340px] p-8 px-6">
                {/* 모달 */}
                {modalType === "confirm" && (
                    <div className="flex flex-col items-center text-center">
                        <button onClick={closeModal} className="absolute top-6 left-6">
                            <img src={closeIcon} alt="close" className="w-5 h-5 opacity-40" />
                        </button>
                        <div className="mt-8 mb-6">
                            <img src={checkIcon} alt="check" className="w-[80px] h-[80px]" />
                        </div>
                        <h3 className="text-[20px] font-bold text-text-black mb-10">제안을 수락하시겠습니까?</h3>
                        <div className="flex w-full gap-3">
                            <button onClick={closeModal} className="w-[90px] py-4 border border-core-3 rounded-[16px] text-core-1 font-bold">취소</button>
                            <button onClick={handleConfirm} className="flex-1 py-4 bg-core-1 rounded-[16px] text-white font-bold">수락하기</button>
                        </div>
                    </div>
                )}

                {modalType === "success" && (
                    <div className="flex flex-col items-center text-center py-4">
                        <div className="mb-6"><img src={checkIcon} alt="check" className="w-[80px] h-[80px]" /></div>
                        <h3 className="text-[22px] font-bold text-text-black mb-2">수락하기 완료</h3>
                        <p className="text-[16px] text-text-gray3 mb-10 leading-snug">브랜드와 채팅방에서<br />협업을 진행해주세요</p>
                        <button onClick={() => window.location.reload()} className="w-full py-4 bg-core-1 rounded-[16px] text-white font-bold">완료하기</button>
                    </div>
                )}

                {modalType === "reject" && (
                    <div className="flex flex-col w-full">
                        <h3 className="text-[18px] font-bold text-text-black mb-6">비플레인 선크림 리뷰 콘텐츠</h3>

                        <div className="flex flex-col gap-2 mb-8">
                            <label className="text-[16px] font-bold text-text-black">거절 이유</label>
                            <div className="relative">
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value.slice(0, 500))}
                                    placeholder="거절 이유를 입력해주세요"
                                    className="w-full h-[160px] p-4 bg-white border border-text-gray5 rounded-[12px] text-body1 resize-none focus:outline-none focus:border-core-1"
                                />
                                <span className="absolute bottom-3 right-4 text-[12px] text-text-gray4">
                                    {rejectReason.length}/500
                                </span>
                            </div>
                            <p className="text-[12px] text-text-gray3">*거절 이유 작성은 선택사항 입니다</p>
                        </div>

                        <div className="flex w-full gap-3">
                            <button onClick={closeModal} className="w-[90px] py-4 border border-core-3 rounded-[16px] text-core-1 font-bold">취소하기</button>
                            <button
                                onClick={handleRejectSubmit}
                                disabled={isProcessing}
                                className="flex-1 py-4 bg-core-1 rounded-[16px] text-white font-bold disabled:bg-text-gray5"
                            >
                                {isProcessing ? "처리 중..." : "거절하기"}
                            </button>
                        </div>
                    </div>
                )}

                {modalType === "rejectSuccess" && (
                    <div className="flex flex-col items-center text-center py-4">
                        <div className="mb-6"><img src={checkIcon} alt="check" className="w-[80px] h-[80px]" /></div>
                        <h3 className="text-[22px] font-bold text-text-black mb-2">거절하기 완료</h3>
                        <p className="text-[16px] text-text-gray3 mb-10">다른 협업을 확인해주세요</p>
                        <button onClick={() => window.location.reload()} className="w-full py-4 bg-core-1 rounded-[16px] text-white font-bold">완료하기</button>
                    </div>
                )}
            </Modal>
        </div>
    );
}

function ContentItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-callout1 text-[var(--color-text-gray2)]">{label}</p>
            <div className="w-full h-[34px] flex justify-between items-center bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-[6px] box-border">
                <span className="flex-1 truncate pl-[16px] text-callout1 text-[var(--color-text-gray1)]">
                    {value}
                </span>
                <img src={arrowRightIcon} alt="arrow" className="w-4 h-4 shrink-0 mr-[12px] opacity-30" />
            </div>
        </div>
    );
}
