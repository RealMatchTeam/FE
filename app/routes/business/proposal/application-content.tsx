import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAppliedCampaignDetail, type AppliedCampaignDetail } from "./api/proposal";

import Modal from "../../../components/common/Modal";

import Header from "../../../components/layout/Header";
import CampaignBrandCard from "../components/CampaignBrandCard";
import CampaignInfoGroup from "../components/CampaignInfoGroup";

import arrowPurpleIcon from "../../../assets/arrow-purple.svg";
import profileIcon from "../../../assets/icon-profile.svg";

import checkIcon from "../../../assets/icon/icon-check-circle.svg"; 
import closeIcon from "../../../assets/icon/icon-close.svg";

export default function ApplicationContent() {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState<AppliedCampaignDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState<"CONFIRM" | "COMPLETE">("CONFIRM");

    const applicationId = searchParams.get("applicationId");

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setModalStep("CONFIRM"), 300);
    };

    useEffect(() => {
        if (!applicationId) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const result = await getAppliedCampaignDetail(applicationId as string);
                setData(result);
            } catch (error) {
                console.error("지원 상세 조회 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [applicationId]);

    const handleCancelSubmit = async () => {
        try {
            console.log("지원 취소 프로세스 시작");
            setModalStep("COMPLETE");
        } catch (error) {
            console.error("취소 실패:", error);
        }
    };

    if (isLoading) return <div className="p-10 text-center">로딩 중...</div>;
    if (!data) return <div className="p-10 text-center">데이터를 찾을 수 없습니다.</div>;

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "REVIEWING": return "검토 중";
            case "MATCHED": return "수락됨";
            case "REJECTED": return "거절됨";
            case "CANCELED": return "취소됨";
            default: return "상태 미정";
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-bg-w font-pretendard">
            <Header title="지원 상세 보기" />

            <main className="flex flex-col pb-24">
                {/* 상단 브랜드 정보 섹션 */}
                <div className="px-4 py-6">
                    <CampaignBrandCard
                        showChatSection={false}
                        statusText={getStatusLabel(data.status)} 
                        brandName={data.brandName || "브랜드 정보 없음"}
                        brandTags={["#지원완료"]}
                    />

                    <div className="flex flex-col gap-6">
                        {/* 캠페인 제목 */}
                        <div className="flex items-center gap-1 group cursor-pointer">
                            <h2 className="text-title1 text-text-black">
                                ‘{data.campaignTitle}’
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

                {/* 지원 이유 섹션 */}
                <div className="bg-bluegray-1 px-4 py-4 flex flex-col gap-6 flex-1">
                    <CampaignInfoGroup label="지원 이유">
                        <div className="w-full p-5 bg-bg-w border border-text-gray5 rounded-xl text-body1 leading-relaxed text-text-gray1 min-h-[160px]">
                            {data.campaignReason || "작성된 지원 이유가 없습니다."}
                        </div>
                    </CampaignInfoGroup>
                </div>

                {/* 하단 버튼 영역 */}
                <div className="px-4 py-5 flex justify-end bg-bg-w border-t border-bluegray-2">
                    <button
                        onClick={() => setIsModalOpen(true)} 
                        className="px-6 py-2.5 bg-bg-w border border-core-3 rounded-xl text-core-1 text-title3 hover:bg-bluegray-1 transition-colors"
                    >
                        취소하기
                    </button>
                </div>
            </main>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <div className="flex flex-col items-center">
                    {/* 닫기 버튼 (X) */}
                    <button onClick={handleCloseModal} className="absolute top-6 left-6">
                        <img src={closeIcon} alt="close" className="w-5 h-5 opacity-40" />
                    </button>

                    {/* 체크 아이콘 */}
                    <div className="mt-4 mb-8">
                        <img src={checkIcon} alt="check" className="w-24 h-24" />
                    </div>

                    {modalStep === "CONFIRM" ? (
                        <>
                            <h3 className="text-[20px] font-bold text-text-black mb-10 leading-snug">
                                제안을 취소하시겠습니까?
                            </h3>
                            <div className="flex w-full gap-3">
                                <button
                                    onClick={handleCancelSubmit}
                                    className="w-[90px] py-4 bg-white border border-[#6366f1] text-[#6366f1] rounded-[16px] font-bold"
                                >
                                    예
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    className="flex-1 py-4 bg-[#6366f1] text-white rounded-[16px] font-bold"
                                >
                                    아니오
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 className="text-[22px] font-bold text-text-black mb-2">취소하기 완료</h3>
                            <p className="text-[16px] text-text-gray2 mb-10 leading-tight">
                                브랜드에게 보낸<br />제안이 취소되었습니다
                            </p>
                            <button
                                onClick={handleCloseModal}
                                className="w-full py-4 bg-[#6366f1] text-white rounded-[16px] font-bold text-[18px]"
                            >
                                완료하기
                            </button>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
}