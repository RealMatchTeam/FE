import { useState } from "react";
import { useCreateCampaignMutation } from "../../../../hooks/queries/useCampaign";

import Header from "../../../../components/layout/Header";
import CampaignBrandCard from "../components/CampaignBrandCard";
import CampaignInfoGroup from "../components/CampaignInfoGroup";

import editIcon from "../../../../assets/icon-edit.svg";
import dropdownIcon from "../../../../assets/arrow-down.svg";
import dropupIcon from "../../../../assets/arrow-up.svg";
import arrowRightIcon from "../../../../assets/arrow-right.svg";
import calendarIcon from "../../../../assets/icon-calender.svg";

export default function CampaignContent() {
  const [isContentOpen, setIsContentOpen] = useState(false);
  
  // 1. API 전송을 위한 상태 관리
  const [campaignData, setCampaignData] = useState({
    brandId: 1,
    campaignId: null, // 신규 캠페인
    campaignName: "비플레인 클렌징 및 세럼 리뷰 콘텐츠",
    description: "안녕하세요 크리에이터 비비 입니다! 비플레인의 가치가 제 채널에서 소개하는 뷰티 콘텐츠와 잘 맞닿아 있다고 생각되어 협찬을 제안드립니다.",
    rewardAmount: 200000,
    startDate: "2025-01-20",
    endDate: "2025-01-30",
    // 태그/형식 등은 초기값 혹은 API로 받아온 ID값 세팅
    formats: [{ id: "32000000-0000-0000-0000-000000000000" }],
    categories: [{ id: "31310000-0000-0000-0000-000000000000", customValue: "성분 분석 리뷰" }],
    tones: [
        { id: "31360000-0000-0000-0000-000000000000" },
        { id: "31330000-0000-0000-0000-000000000000" }
    ],
    involvements: [{ id: "32320000-0000-0000-0000-000000000000" }],
    usageRanges: [{ id: "32350000-0000-0000-0000-000000000000" }],
    productId: 5
  });

  // 2. TanStack Query Mutation 사용
  const { mutate, isPending } = useCreateCampaignMutation();

  const handleSubmit = () => {
    // 실제 전송 로직
    mutate(campaignData);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[var(--color-bluegray-1)] relative">
      <Header title="캠페인 보기" />

      <main className="flex flex-col px-4 py-6 gap-6 pb-32">
        <CampaignBrandCard />

        <div className="flex flex-col gap-5">
          {/* 캠페인명 */}
          <CampaignInfoGroup
            label="캠페인명"
            right={<img src={editIcon} alt="edit" className="w-4 h-4 cursor-pointer" />}
          >
            <input
              type="text"
              value={campaignData.campaignName}
              onChange={(e) => setCampaignData({...campaignData, campaignName: e.target.value})}
              className="w-full p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1 focus:outline-none focus:border-blue-400"
            />
          </CampaignInfoGroup>

          {/* 캠페인 내용 */}
          <CampaignInfoGroup
            label="캠페인 내용"
            right={
              <button onClick={() => setIsContentOpen((prev) => !prev)}>
                <img
                  src={isContentOpen ? dropupIcon : dropdownIcon}
                  alt="toggle"
                />
              </button>
            }
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-callout1 text-[var(--color-text-gray3)]">설명</p>
                <textarea
                  value={campaignData.description}
                  onChange={(e) => setCampaignData({...campaignData, description: e.target.value})}
                  className="w-full p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1 leading-relaxed min-h-[120px] resize-none focus:outline-none"
                />
              </div>

              {isContentOpen && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
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
              <div className="w-full p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1 flex justify-between items-center cursor-pointer">
                글로우 크림 1개
                <img src={arrowRightIcon} alt="arrow" className="w-4 h-4" />
              </div>
            </CampaignInfoGroup>

            <CampaignInfoGroup label="원고료">
              <div className="w-full p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1 flex justify-between items-center">
                <input 
                  type="number" 
                  value={campaignData.rewardAmount}
                  onChange={(e) => setCampaignData({...campaignData, rewardAmount: Number(e.target.value)})}
                  className="w-full focus:outline-none"
                />
                <span className="shrink-0 ml-1">원</span>
              </div>
            </CampaignInfoGroup>
          </div>

          {/* 제작 기간 */}
          <CampaignInfoGroup
            label="제작 기간"
            right={<img src={calendarIcon} alt="calendar" className="w-4 h-4" />}
          >
            <div className="flex items-center gap-2">
              <div className="flex-1 p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1 text-center">
                {campaignData.startDate}
              </div>
              <span className="text-[var(--color-text-gray3)]">~</span>
              <div className="flex-1 p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1 text-center">
                {campaignData.endDate}
              </div>
            </div>
          </CampaignInfoGroup>

          {/* 기타 협의 사항 */}
          <CampaignInfoGroup
            label="기타 협의 사항"
            right={<img src={editIcon} alt="edit" className="w-4 h-4" />}
          >
            <div className="w-full p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1 text-[var(--color-text-gray3)]">
              기타 협의 사항을 입력해주세요
            </div>
          </CampaignInfoGroup>
        </div>
      </main>

      {/* 하단 제안하기 버튼 섹션 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[var(--color-text-gray5)] max-w-[430px] mx-auto z-10">
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full py-4 bg-[#6366F1] text-white rounded-xl font-bold text-lg active:scale-95 transition-transform disabled:bg-gray-400"
        >
          {isPending ? "제안 보내는 중..." : "제안하기"}
        </button>
      </div>
    </div>
  );
}

function ContentItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-callout1 text-[var(--color-text-gray3)]">{label}</p>
      <div className="p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1 flex justify-between items-center cursor-pointer active:bg-gray-50">
        <span className="truncate">{value}</span>
        <img src={arrowRightIcon} alt="arrow" className="w-4 h-4 shrink-0" />
      </div>
    </div>
  );
}