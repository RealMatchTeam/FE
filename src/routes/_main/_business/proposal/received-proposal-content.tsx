import { useState } from "react";
import Header from "../../../../components/layout/Header";
import CampaignBrandCard from "../components/CampaignBrandCard";
import CampaignInfoGroup from "../components/CampaignInfoGroup";
import Modal from "../../../../components/common/Modal";

import dropdownIcon from "../../../../assets/arrow-down.svg";
import dropupIcon from "../../../../assets/arrow-up.svg";
import arrowRightIcon from "../../../../assets/icon/arrow-right.svg";
import profileIcon from "../../../../assets/logo/mini-logo.svg";
import checkIcon from "../../../../assets/icon/icon-check-circle.svg";
import closeIcon from "../../../../assets/icon/icon-close.svg";

export default function ReceivedProposalContent() {
    const [modalType, setModalType] = useState<"none" | "confirm" | "success">("none");
    const [isContentOpen, setIsContentOpen] = useState(false);

    const handleAcceptClick = () => setModalType("confirm");
    const handleConfirm = () => setModalType("success");
    const closeModal = () => setModalType("none");

    return (
        <div className="flex flex-col w-full min-h-screen bg-[var(--color-bg-w)] font-pretendard relative">
            <Header title="제안 보기" showBack={true} />

            {/* 배경색 및 간격을 CampaignContent와 동일하게 유지 */}
            <main className="flex flex-col bg-[var(--color-bluegray-1)]">
                {/* 1. 상단 섹션: 브랜드 카드 및 타이틀 */}
                {/* CampaignContent와 동일하게 상단만 흰색 배경 유지하거나 구분감 부여 */}
                <div className="bg-[var(--color-bg-w)] px-4 py-6 flex flex-col gap-2">
                    <CampaignBrandCard showChatSection={false} statusText="검토 중" />
                    <div>
                        <h2 className="text-title1 text-text-black">브랜드 제안 캠페인</h2>
                    </div>
                </div>

                {/* 2. 상세 정보 섹션: 여기서부터 회색 배경(bluegray-1) */}
                <div className="px-4 py-8 flex flex-col gap-6">
                    <CampaignInfoGroup label="캠페인명">
                        <div className="w-full h-[36px] px-4 flex items-center bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-[6px] text-callout1 text-[var(--color-text-gray1)]">
                            비플레인 선크림 리뷰 콘텐츠
                        </div>
                    </CampaignInfoGroup>

                    {/* 캠페인 내용 */}
                    <CampaignInfoGroup
                        label="캠페인 내용"
                        right={
                            <button onClick={() => setIsContentOpen((prev) => !prev)}>
                                <img src={isContentOpen ? dropupIcon : dropdownIcon} alt="toggle" className="w-4 h-4" />
                            </button>
                        }
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <p className="text-callout1 text-[var(--color-text-gray2)]">설명</p>
                                <div className="w-full min-h-[68px] px-[16px] py-[10px] bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-[6px] text-callout1 text-[var(--color-text-gray1)] leading-relaxed">
                                    안녕하세요 비플레인 입니다! <br />
                                    크리에이터님과 이미지가 잘 맞아 협찬을 제안드립니다.
                                </div>
                            </div>

                            {isContentOpen && (
                                <div className="grid grid-cols-2 gap-x-[11px] gap-y-4 animate-in fade-in duration-300">
                                    <div className="col-span-2">
                                        <ContentItem label="형식" value="인스타그램 릴스" />
                                    </div>
                                    <ContentItem label="종류" value="겟레디윗미, 스토리" />
                                    <ContentItem label="톤" value="수다적인, 일상적인" />
                                    <ContentItem label="관여도" value="가이드만 제공" />
                                    <ContentItem label="활용 범위" value="크리에이터 1차 활용" />
                                </div>
                            )}
                        </div>
                    </CampaignInfoGroup>

                    {/* 협찬품 / 원고료: 높이 36px 통일 */}
                    <div className="grid grid-cols-2 gap-4">
                        <CampaignInfoGroup label="협찬품">
                            <div className="w-full h-[36px] px-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-[6px] text-callout1 text-[var(--color-text-gray1)] flex justify-between items-center">
                                <span className="truncate">글로우 크림 1개</span>
                                <img src={arrowRightIcon} alt="arrow" className="w-4 h-4 opacity-30" />
                            </div>
                        </CampaignInfoGroup>

                        <CampaignInfoGroup label="원고료">
                            <div className="w-full h-[36px] px-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-[6px] text-callout1 text-[var(--color-text-gray1)] flex justify-between items-center">
                                <span>200,000</span>
                                <span className="shrink-0 ml-1">원</span>
                            </div>
                        </CampaignInfoGroup>
                    </div>

                    {/* 제작 기간: 36px 및 pl-4 통일 */}
                    <CampaignInfoGroup label="제작 기간">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-[36px] flex items-center pl-[16px] bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-[6px] text-callout1 text-[var(--color-text-gray1)]">
                                2025-01-20
                            </div>
                            <span className="text-[var(--color-text-gray3)] text-date-separator">~</span>
                            <div className="flex-1 h-[36px] flex items-center pl-[16px] bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-[6px] text-callout1 text-[var(--color-text-gray1)]">
                                2025-01-30
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
                {/* 모달 내용은 기존 디자인 유지 (글로벌 규격 적용) */}
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
                                className="w-[76px] h-[44px] flex items-center justify-center border border-core-3 rounded-[10px] bg-bg-w text-core-1 text-title3"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-1 h-[44px] flex items-center justify-center bg-core-1 rounded-[10px] text-white text-title3 font-medium"
                            >
                                수락하기
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

// ContentItem: CampaignContent의 규격(h-34, text-callout1)으로 수정
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