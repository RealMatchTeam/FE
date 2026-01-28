import { useState } from "react";

import Header from "../../../../components/layout/Header";
import CampaignBrandCard from "../components/CampaignBrandCard";
import CampaignInfoGroup from "../components/CampaignInfoGroup";

import dropdownIcon from "../../../../assets/arrow-down.svg";
import dropupIcon from "../../../../assets/arrow-up.svg";
import arrowRightIcon from "../../../../assets/arrow-right.svg";
import arrowPurpleIcon from "../../../../assets/arrow-purple.svg";
import profileIcon from "../../../../assets/icon-profile.svg";

export default function ProposalContent() {
    const [isContentOpen, setIsContentOpen] = useState(false);

    return (
        <div className="flex flex-col w-full min-h-screen bg-bg-w font-pretendard">
            <Header title="제안 보기" />

            <main className="flex flex-col pb-24">
                {/* 1. 상단 섹션: 브랜드 카드 및 제안 프로필 */}
                <div className="px-4 py-6">
                    <CampaignBrandCard
                        showChatSection={false}
                        statusText="검토 중"
                    />

                    <div className="flex flex-col gap-4">
                        <h2 className="text-title1 text-text-black">신규 캠페인</h2>

                        <div className="flex flex-col gap-2">
                            <p className="text-title3 text-text-gray2">제안 프로필</p>
                            
                            <div className="w-full p-4 bg-bluegray-2 rounded-2xl flex justify-between items-center border border-core-70">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center">
                                        <img src={profileIcon} alt="profile" />
                                    </div>
                                    <span className="text-callout1 text-text-black">@ivveeee</span>
                                </div>
                                <img src={arrowPurpleIcon} alt="arrow"/>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. 상세 정보 섹션 */}
                <div className="bg-bluegray-1 px-4 py-8 flex flex-col gap-6">
                    {/* 캠페인명 */}
                    <CampaignInfoGroup label="캠페인명">
                        <div className="w-full p-4 bg-bg-w border border-text-gray5 rounded-xl text-body1 text-text-gray1">
                            비플레인 클렌징 및 세럼 리뷰 콘텐츠
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
                                    안녕하세요 크리에이터 비비 입니다! 비플레인의 가치가 제 채널에서 소개하는
                                    뷰티 콘텐츠와 잘 맞닿아 있다고 생각되어 협찬을 제안드립니다.
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
                                200,000 <span className="text-text-black">원</span>
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

                <div className="px-4 py-5 flex justify-end bg-bg-w">
                    <button className="px-4 py-2 bg-bg-w border border-core-3 rounded-xl text-core-1 text-title3 hover:bg-bluegray-1 transition-colors">
                        취소하기
                    </button>
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