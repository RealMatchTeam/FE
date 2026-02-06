import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import RealmatchHeader from "../../../components/common/RealmatchHeader";
import CampaignBrandCard from "../components/CampaignBrandCard";
import CampaignInfoGroup from "../components/CampaignInfoGroup";
import Modal from "../../../components/common/Modal";

import { getProposalDetail, getBrandDetail, approveCampaignProposal, type ProposalDetail } from "./api/proposal";
import type { BrandDetail } from "../../../data/brand";

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
    const [brand, setBrand] = useState<BrandDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [modalType, setModalType] = useState<"none" | "confirm" | "success">("none");
    const [isContentOpen, setIsContentOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); 

    useEffect(() => {
        const fetchData = async () => {
            if (!proposalId || typeof proposalId !== "string") return;
            try {
                setIsLoading(true);
                // 1. 제안 상세 정보 가져오기
                const proposalResult = await getProposalDetail(proposalId);
                setProposal(proposalResult);

                // 2. 제안 정보에 있는 brandId로 브랜드 상세 정보 가져오기
                if (proposalResult.brandId) {
                    const brandResult = await getBrandDetail(proposalResult.brandId);
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
    const closeModal = () => setModalType("none");

    // 태그 배열을 문자열로 변환하는 헬퍼 함수
    const formatTags = (tags: { name: string }[] | undefined | null) => {
        if (!tags || tags.length === 0) return "정보 없음"; 
        return tags.map(t => t.name).join(", ");
    };

    // 날짜 포맷 변경 함수
    const formatDate = (dateStr: string) => (dateStr || "").replace(/-/g, ". ");

    if (isLoading) return <div className="p-10 text-center text-text-gray3 font-pretendard">로딩 중...</div>;
    if (!proposal) return <div className="p-10 text-center text-text-gray3 font-pretendard">데이터를 찾을 수 없습니다.</div>;

    return (
        <div className="flex flex-col w-full min-h-screen bg-[var(--color-bg-w)] font-pretendard relative">
            <RealmatchHeader title="제안 보기" showBack={true} />

            <main className="flex flex-col bg-[var(--color-bluegray-1)]">
                <div className="bg-[var(--color-bg-w)] px-4 py-6 flex flex-col gap-2">
                    <CampaignBrandCard
                        showChatSection={false}
                        statusText={proposal.status === "MATCHED" ? "매칭 완료" : "검토 중"}
                        brandName={brand?.brandName}
                        brandTags={brand?.brandTag}
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
                <button className="flex-1 h-[52px] bg-[var(--color-bg-w)] border border-[var(--color-core-3)] rounded-xl text-core-1 text-title3 active:bg-gray-50 transition-colors">
                    거절하기
                </button>
                <button
                    onClick={handleAcceptClick}
                    className="flex-[2.5] h-[52px] bg-core-1 rounded-xl text-white text-title3 flex items-center justify-center gap-2 active:opacity-90 transition-opacity"
                >
                    <img src={profileIcon} alt="logo" className="w-6 h-6 invert brightness-0" />
                    <span>제안 수락하기</span>
                </button>
            </div>

            <Modal isOpen={modalType !== "none"} onClose={closeModal}>
                {/* 모달 */}
                {modalType === "confirm" && (
                    <div className="flex flex-col items-center text-center">
                        <button onClick={closeModal} className="absolute top-4 left-4">
                            <img src={closeIcon} alt="close" className="w-6 h-6" />
                        </button>
                        <div className="mt-8 mb-6">
                            <img src={checkIcon} alt="check" className="w-[80px] h-[80px]" />
                        </div>
                        <h3 className="text-callout3 text-text-black mb-10">제안을 수락하시겠습니까?</h3>
                        <div className="flex w-full gap-[10px] justify-center items-center">
                            <button
                                onClick={closeModal}
                                disabled={isProcessing}
                                className="w-[76px] h-[44px] flex items-center justify-center border border-core-3 rounded-[10px] bg-bg-w text-core-1 text-title3"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isProcessing}
                                className="flex-1 h-[44px] flex items-center justify-center bg-core-1 rounded-[10px] text-white text-title3 font-medium"
                            >
                                {isProcessing ? "처리 중..." : "수락하기"}
                            </button>
                        </div>
                    </div>
                )}

                {modalType === "success" && (
                    <div className="flex flex-col items-center text-center py-4">
                        <div className="mb-6">
                            <img src={checkIcon} alt="check" className="w-[80px] h-[80px]" />
                        </div>
                        <h3 className="text-callout3 text-text-black mb-2">수락하기 완료</h3>
                        <p className="text-body1 text-text-gray3 mb-10">브랜드와 채팅방에서<br />협업을 진행해주세요</p>
                        <button onClick={closeModal} className="w-full py-4 bg-core-1 rounded-xl text-white text-title3">완료하기</button>
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