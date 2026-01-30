import { useState } from "react";

import Header from "../../../../components/layout/Header";
import CampaignBrandCard from "../components/CampaignBrandCard";
import CampaignInfoGroup from "../components/CampaignInfoGroup";

import dropdownIcon from "../../../../assets/arrow-down.svg";
import dropupIcon from "../../../../assets/arrow-up.svg";
import arrowRightIcon from "../../../../assets/icon/arrow-right.svg";
import profileIcon from "../../../../assets/logo/mini-logo.svg"; 

export default function ReceivedProposalContent() {
    const [isContentOpen, setIsContentOpen] = useState(false);

    return (
        <div className="flex flex-col w-full min-h-screen bg-bg-w font-pretendard">
            <Header title="제안 보기" />

            <main className="flex flex-col pb-24">
                {/* 1. 상단 섹션: 브랜드 카드 */}
                <div className="px-4 py-6">
                    <CampaignBrandCard
                        showChatSection={false}
                        statusText="검토 중"
                    />
                    <div className="mt-6">
                        <h2 className="text-title1 text-text-black">브랜드 제안 캠페인</h2>
                    </div>
                </div>

                {/* 2. 상세 정보 섹션 */}
                <div className="bg-bluegray-1 px-4 py-8 flex flex-col gap-6">
                    {/* 캠페인명 */}
                    <CampaignInfoGroup label="캠페인명">
                        <div className="w-full p-4 bg-bg-w border border-text-gray5 rounded-xl text-body1 text-text-gray1">
                            비플레인 선크림 리뷰 콘텐츠
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
                                    안녕하세요 비플레인 입니다! <br />
                                    크리에이터님과 이미지와 비플레인이 추구하는 가치가 잘 맞닿아 있다고 생각되어 협찬을 제안드립니다.
                                </div>
                            </div>

                            {/* 아코디언 상세 내용 */}
                            {isContentOpen && (
                                <div className="grid grid-cols-2 gap-4 animate-slide-up">
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

                    {/* 협찬품 / 원고료 */}
                    <div className="grid grid-cols-2 gap-4">
                        <CampaignInfoGroup label="협찬품">
                            <div className="w-full p-4 bg-bg-w border border-text-gray5 rounded-xl text-body1 flex justify-between items-center text-text-gray1">
                                <span className="truncate">글로우 크림 1개</span>
                                <img src={arrowRightIcon} alt="arrow" className="w-4 h-4 opacity-30" />
                            </div>
                        </CampaignInfoGroup>

                        <CampaignInfoGroup label="원고료">
                            <div className="w-full p-4 bg-bg-w border border-text-gray5 rounded-xl text-body1 flex justify-between items-center text-text-gray1">
                                200,000 <span className="text-text-black ml-1">원</span>
                            </div>
                        </CampaignInfoGroup>
                    </div>

                    {/* 제작 기간 */}
                    <CampaignInfoGroup label="제작 기간">
                        <div className="flex items-center gap-2 text-text-gray1">
                            <div className="flex-1 p-4 bg-bg-w border border-text-gray5 rounded-xl text-body1">
                                2025년 1월 20일
                            </div>
                            <span className="text-text-gray3">~</span>
                            <div className="flex-1 p-4 bg-bg-w border border-text-gray5 rounded-xl text-body1">
                                2025년 1월 30일
                            </div>
                        </div>
                    </CampaignInfoGroup>
                </div>

                {/* 3. 하단 액션 버튼 (거절하기 / 제안 수락하기) */}
                <div className="px-2 py-5 flex gap-3 bg-bg-w">
                    <button className="flex-1 w-[102px] py-[10px] px-[16px] bg-bg-w border border-core-3 rounded-xl text-core-1 text-title3 hover:bg-bluegray-1 transition-colors">
                        거절하기
                    </button>
                    <button
                        className="flex-[2.5] py-4 bg-core-1 rounded-xl text-bg-w text-title3 flex items-center justify-center gap-2 hover:bg-core-2 transition-colors shadow-sm"
                    >
                        {/* 미니 로고 아이콘 */}
                        <div className="flex items-center justify-center w-6 h-6">
                            <img
                                src={profileIcon} 
                                alt="mini-logo"
                                className="w-full h-full object-contain invert brightness-0" 
                            />
                        </div>
                        <span>제안 수락하기</span>
                    </button>
                </div>
            </main>
        </div>
    );
}

// 기존 ContentItem 재사용
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