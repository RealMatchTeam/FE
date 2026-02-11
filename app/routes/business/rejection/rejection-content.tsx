import { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import Header from "../../../components/layout/Header";
import CampaignBrandCard from "../components/CampaignBrandCard";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

import { getProposalDetail, type ProposalDetail } from "../proposal/api/proposal";
import { getBrandSummary, type BrandSummary } from "../proposal/api/brand";

import dropdownIcon from "../../../assets/arrow-down.svg";
import dropupIcon from "../../../assets/arrow-up.svg";

export default function RejectionContent() {
    const [searchParams] = useSearchParams();
    const location = useLocation();

    const proposalId = searchParams.get("proposalId");
    const brandIdFromState = location.state?.brandId;

    const [data, setData] = useState<ProposalDetail | null>(null);
    const [brand, setBrand] = useState<BrandSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isReasonOpen, setIsReasonOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!proposalId) return;
            try {
                setIsLoading(true);
                // 1. 캠페인/제안 상세 정보 로드 (거절 사유 포함되어 있다고 가정)
                const result = await getProposalDetail(proposalId);
                setData(result);

                // 2. 브랜드 정보 로드
                const targetBrandId = result.brandId || brandIdFromState;
                if (targetBrandId) {
                    const brandResult = await getBrandSummary(targetBrandId);
                    setBrand(brandResult);
                }
            } catch (error) {
                console.error("데이터 로드 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [proposalId, brandIdFromState]);

    if (isLoading) return <LoadingSpinner className="py-10" />;
    if (!data) return <div className="p-10 text-center">정보를 찾을 수 없습니다.</div>;

    return (
        <div className="flex flex-col w-full min-h-screen bg-bg-w font-pretendard">
            <Header title="거절 사유" />

            <main className="flex flex-col pb-24">
                {/* 1. 상단 브랜드 정보 영역 */}
                <div className="px-4 py-6 flex flex-col gap-2">
                    <CampaignBrandCard
                        showChatSection={false}
                        statusText="거절됨" // 고정 텍스트 혹은 데이터 기반
                        brandName={brand?.brandName}
                        brandImageUrl={brand?.brandImageUrl}
                        brandTags={brand?.brandTags || ["거절"]}
                        matchingRate={brand?.matchingRate}
                    />

                    <div className="px-1">
                        <h2 className="text-title6 text-text-black underline decoration-1 underline-offset-[6px]">
                            ‘{data.title}’
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
                                    {data.refusalReason || "거절 사유가 입력되지 않았습니다."}
                                </p>
                            </div>
                        )}

                        {/* 드롭다운이 열려있을 때 전체 내용 표시 */}
                        {isReasonOpen && (
                            <div className="px-5 pb-6 animate-slide-up">
                                <p className="text-body1 text-text-gray1 leading-[1.6] whitespace-pre-wrap">
                                    {data.refusalReason || "등록된 거절 사유 상세 내용이 없습니다."}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* 내 제안 보기 섹션 */}
                    <div className="flex flex-col gap-3">
                        <div className="w-full p-5 bg-bg-w border border-text-gray5 rounded-2xl">
                            <h3 className="text-title1 text-text-gray1 font-bold">내 제안 보기</h3>
                            <p className="text-body1 text-text-gray3 mt-2 leading-relaxed">
                                {data.description || "상세 제안 내용이 없습니다."}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
