import { useState } from "react";

import Header from "../../../components/layout/Header";
import CampaignBrandCard from "../components/CampaignBrandCard";

import dropdownIcon from "../../../assets/arrow-down.svg";
import dropupIcon from "../../../assets/arrow-up.svg";

export default function RejectionContent() {
    const [isReasonOpen, setIsReasonOpen] = useState(false);

    return (
        <div className="flex flex-col w-full min-h-screen bg-bg-w font-pretendard">
            <Header title="거절 사유" />

            <main className="flex flex-col pb-24">
                {/* 1. 상단 브랜드 정보 영역 */}
                <div className="px-4 py-6 flex flex-col gap-2">
                    <CampaignBrandCard
                        showChatSection={false}
                        statusText="" // 빈 값을 넘겨 '거절' 텍스트를 숨김
                    />

                    <div className="px-1">
                        <h2 className="text-title6 text-text-black underline decoration-1 underline-offset-[6px]">
                            ‘글로우 쿠션’ 신제품 론칭 리뷰
                        </h2>
                    </div>
                </div>

                {/* 2. 하단 상세 내용 영역 */}
                <div className="px-4 flex flex-col gap-3 flex-1">
                    
                    {/* 거절 사유 박스 */}
                    <div className="flex flex-col bg-bluegray-2 rounded-2xl overflow-hidden">
                        <button 
                            onClick={() => setIsReasonOpen(prev => !prev)}
                            className={`w-full p-5 flex justify-between items-center ${!isReasonOpen ? 'pb-2' : ''}`}
                        >
                            <span className="text-title1 text-core-1">거절 사유</span>
                            <img 
                                src={isReasonOpen ? dropupIcon : dropdownIcon} 
                                alt="toggle"
                                style={{ filter: 'invert(44%) sepia(87%) saturate(1754%) hue-rotate(222deg) brightness(92%) contrast(97%)' }}
                            />
                        </button>

                        {/* 드롭다운이 닫혀있을 때 한 줄 요약 표시 */}
                        {!isReasonOpen && (
                            <div className="px-5 pb-5">
                                <p className="text-body1 text-text-gray1 truncate">
                                    안녕하세요 크리에이터 비비 님...
                                </p>
                            </div>
                        )}

                        {/* 드롭다운이 열려있을 때 전체 내용 표시 */}
                        {isReasonOpen && (
                            <div className="px-5 pb-6 animate-slide-up">
                                <p className="text-body1 text-text-gray1 leading-[1.6] whitespace-pre-wrap">
                                    안녕하세요 크리에이터 비비님,{"\n\n"}
                                    먼저 저희 브랜드에 제안 주신 점 진심으로 감사드립니다.{"\n\n"}
                                    현재 크리에이터님 채널의 콘텐츠 방향이 저희 브랜드가 추구하는 이미지와 완전히 일치하지 않아 이번 협찬은 진행이 어렵다는 점 양해 부탁드립니다.{"\n\n"}
                                    좋은 제안 주셨음에도 긍정적인 답변을 드리지 못해 아쉽게 생각하며, 향후 방향이 맞는 프로젝트가 있다면 다시 함께할 기회가 있기를 바랍니다.{"\n\n"}
                                    감사합니다.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* 내 제안 보기 섹션 */}
                    <div className="flex flex-col gap-3">
                        <div className="w-full p-5 bg-bg-w border border-text-gray5 rounded-2xl">
                            <h3 className="text-title1 text-text-gray1">내 제안 보기</h3>
                            <p className="text-body1 text-text-gray3 mt-2">
                                안녕하세요 크리에이터 비비입니다...
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}