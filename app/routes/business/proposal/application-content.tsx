import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getProposalDetail } from "./api/proposal"; // API 경로 확인 필요
import type { ProposalDetail } from "./api/proposal";

import Header from "../../../components/layout/Header";
import CampaignBrandCard from "../components/CampaignBrandCard";
import CampaignInfoGroup from "../components/CampaignInfoGroup";

import arrowPurpleIcon from "../../../assets/arrow-purple.svg";
import profileIcon from "../../../assets/icon-profile.svg";

export default function ApplicationContent() {
    const [searchParams] = useSearchParams();
    
    // 데이터 상태 관리
    const [data, setData] = useState<ProposalDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const applicationId = searchParams.get("applicationId");

    useEffect(() => {
        if (!applicationId) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setIsLoading(true);
                // 지원하기 상세 조회 API가 별도로 있다면 해당 함수로 교체하세요.
                const result = await getProposalDetail(applicationId);
                setData(result);
            } catch (error) {
                console.error("지원 상세 조회 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [applicationId]);

    if (isLoading) return <div className="p-10 text-center">로딩 중...</div>;
    if (!data) return <div className="p-10 text-center">데이터를 찾을 수 없습니다.</div>;

    return (
        <div className="flex flex-col w-full min-h-screen bg-bg-w font-pretendard">
            <Header title="제안 보기" />

            <main className="flex flex-col pb-24">
                {/* 상단 브랜드 정보 섹션 */}
                <div className="px-4 py-6">
                    <CampaignBrandCard
                        showChatSection={false}
                        statusText="검토 중" // 이미지 기준 고정 혹은 data.status
                        brandName={data.brandName || "비플레인"} // 데이터에 따라 조정
                        brandTags={["#저자극", "#천연재료", "#민감성피부"]} 
                    />

                    <div className="flex flex-col gap-6 mt-4">
                        {/* 캠페인 제목 */}
                        <div className="flex items-center gap-1 group cursor-pointer">
                            <h2 className="text-title1 text-text-black">
                                ‘{data.title}’ 신제품 론칭 리뷰
                            </h2>
                            <img src={arrowPurpleIcon} alt="link" className="w-5 h-5 rotate-[-90deg] opacity-60" />
                        </div>

                        {/* 제안 프로필 */}
                        <div className="flex flex-col gap-2">
                            <p className="text-title3 text-text-gray2">제안 프로필</p>
                            <div className="w-full p-4 bg-bluegray-2 rounded-2xl flex justify-between items-center border border-core-70">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8">
                                        <img src={profileIcon} alt="profile" className="w-full h-full" />
                                    </div>
                                    <span className="text-callout1 text-text-black">
                                        @{data.creatorId || "ivveeee"}
                                    </span>
                                </div>
                                <img src={arrowPurpleIcon} alt="arrow" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 지원 이유 섹션 (회색 배경) */}
                <div className="bg-bluegray-1 px-4 py-8 flex flex-col gap-6 flex-1">
                    <CampaignInfoGroup label="지원 이유">
                        <div className="w-full p-5 bg-bg-w border border-text-gray5 rounded-xl text-body1 leading-relaxed text-text-gray1 min-h-[160px]">
                            {data.description || "안녕하세요 크리에이터 비비 입니다! 비플레인의 가치가 제 채널에서 소개하는 뷰티 콘텐츠와 잘 맞당아 있다고 생각되어 협찬을 제안드립니다."}
                        </div>
                    </CampaignInfoGroup>
                </div>

                {/* 하단 버튼 영역 */}
                <div className="px-4 py-5 flex justify-end bg-bg-w border-t border-bluegray-2">
                    <button className="px-6 py-2.5 bg-bg-w border border-core-3 rounded-xl text-core-1 text-title3 hover:bg-bluegray-1 transition-colors">
                        취소하기
                    </button>
                </div>
            </main>
        </div>
    );
}