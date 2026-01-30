import { useState } from "react";
//import { useCreateCampaignMutation } from "../../../../hooks/queries/useCampaign";

import Header from "../../../../components/layout/Header";
import CampaignBrandCard from "../components/CampaignBrandCard";
import CampaignInfoGroup from "../components/CampaignInfoGroup";

import editIcon from "../../../../assets/icon-edit.svg";
import dropdownIcon from "../../../../assets/arrow-down.svg";
import dropupIcon from "../../../../assets/arrow-up.svg";
import arrowRightIcon from "../../../../assets/icon/arrow-right.svg";
import calendarIcon from "../../../../assets/icon-calender.svg";

export default function CampaignContent() {
  const [isContentOpen, setIsContentOpen] = useState(false);

  const [campaignData, setCampaignData] = useState({
    brandId: 1,
    campaignId: null,
    campaignName: "비플레인 클렌징 및 세럼 리뷰 콘텐츠",
    description: "안녕하세요 크리에이터 비비 입니다! 비플레인의 가치가 제 채널에서 소개하는 뷰티 콘텐츠와 잘 맞닿아 있다고 생각되어 협찬을 제안드립니다.",
    rewardAmount: 200000,
    startDate: "2025-01-20",
    endDate: "2025-01-30",
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

  return (
    // 전체 컨테이너를 흰색 배경으로 설정
    <div className="flex flex-col w-full min-h-screen bg-[var(--color-bg-w)] relative">
      <Header title="캠페인 보기" showBack={true} />

      {/* 기타 협의 사항까지만 회색 배경을 씌움 */}
      <main className="flex flex-col px-4 py-6 gap-6 bg-[var(--color-bluegray-1)]">
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
              onChange={(e) => setCampaignData({ ...campaignData, campaignName: e.target.value })}
              className="w-full h-[36px] px-4 py-[10px] bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-[6px] text-callout1 text-[var(--color-text-gray1)] focus:outline-none focus:border-blue-400 box-border"
            />
          </CampaignInfoGroup>

          {/* 캠페인 내용 */}
          <CampaignInfoGroup
            label="캠페인 내용"
            right={
              <button onClick={() => setIsContentOpen((prev) => !prev)}>
                <img src={isContentOpen ? dropupIcon : dropdownIcon} alt="toggle" />
              </button>
            }
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-callout1 text-[var(--color-text-gray2)]">설명</p>
                <textarea
                  value={campaignData.description}
                  onChange={(e) => setCampaignData({ ...campaignData, description: e.target.value })}
                  className="w-full h-[68px] px-[16px] py-[10px] bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-[6px] text-callout1 text-[var(--color-text-gray1)] leading-relaxed resize-none focus:outline-none"
                />
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

          {/* 협찬품 / 원고료 */}
          <div className="grid grid-cols-2 gap-4">
            <CampaignInfoGroup label="협찬품">
              <div className="w-full h-[36px] px-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-[6px] text-callout1 text-[var(--color-text-gray1)] flex justify-between items-center cursor-pointer active:bg-gray-50">
                <span className="truncate">글로우 크림 1개</span>
                <img src={arrowRightIcon} alt="arrow" className="w-4 h-4" />
              </div>
            </CampaignInfoGroup>

            <CampaignInfoGroup label="원고료">
              <div className="w-full h-[36px] px-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-[6px] text-callout1 text-[var(--color-text-gray1)] flex justify-between items-center">
                <input
                  type="number"
                  value={campaignData.rewardAmount}
                  onChange={(e) => setCampaignData({ ...campaignData, rewardAmount: Number(e.target.value) })}
                  className="w-full focus:outline-none bg-transparent"
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
              <div className="flex-1 h-[36px] flex items-center pl-[16px] bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-[6px] text-callout1 text-[var(--color-text-gray1)]">
                {campaignData.startDate}
              </div>
              <span className="text-[var(--color-text-gray3)] text-date-separator">~</span>
              <div className="flex-1 h-[36px] flex items-center pl-[16px] bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-[6px] text-callout1 text-[var(--color-text-gray1)]">
                {campaignData.endDate}
              </div>
            </div>
          </CampaignInfoGroup>

          {/* 기타 협의 사항 */}
          <CampaignInfoGroup
            label="기타 협의 사항"
            right={<img src={editIcon} alt="edit" className="w-4 h-4" />}
          >
            <div className="w-full h-[36px] px-4 flex items-center bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-[6px]">
            </div>
          </CampaignInfoGroup>
        </div>
      </main>

      {/* 기타 협의 사항 밑으로 흰색 여백 영역 */}
      <div className="bg-[var(--color-bg-w)] h-32 w-full" />
    </div>
  );
}

function ContentItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-callout1 text-[var(--color-text-gray2)]">{label}</p>
      <div className="w-full h-[34px] flex justify-between items-center bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-[6px] cursor-pointer active:bg-gray-50 box-border">
        <span className="flex-1 truncate pt-[5px] pr-[4px] pb-[5px] pl-[16px] text-callout1 text-[var(--color-text-gray1)]">
          {value}
        </span>
        <img src={arrowRightIcon} alt="arrow" className="w-4 h-4 shrink-0 mr-[12px]" />
      </div>
    </div>
  );
}