import { useState } from "react";

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

  return (
    <div className="flex flex-col w-full min-h-screen bg-[var(--color-bluegray-1)]">
      {/* Header */}
      <Header title="캠페인 보기" />

      <main className="flex flex-col px-4 py-6 gap-6 pb-24">
        <CampaignBrandCard />

        <div className="flex flex-col gap-5">
          {/* 캠페인명 */}
          <CampaignInfoGroup
            label="캠페인명"
            right={<img src={editIcon} alt="edit" className="w-4 h-4" />}
          >
            <div className="w-full p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1">
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
                />
              </button>
            }
          >
            <div className="flex flex-col gap-4">
              {/* 설명 */}
              <div className="flex flex-col gap-2">
                <p className="text-callout1 text-[var(--color-text-gray3)]">
                  설명
                </p>
                <div className="w-full p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1 leading-relaxed">
                  안녕하세요 크리에이터 비비 입니다! 비플레인의 가치가 제 채널에서
                  소개하는 뷰티 콘텐츠와 잘 맞닿아 있다고 생각되어 협찬을 제안드립니다.
                </div>
              </div>

              {/* dropdown 열렸을 때 */}
              {isContentOpen && (
                <div className="grid grid-cols-2 gap-4">
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
              <div className="w-full p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1 flex justify-between items-center">
                글로우 크림 1개
                <img src={arrowRightIcon} alt="arrow" className="w-4 h-4" />
              </div>
            </CampaignInfoGroup>

            <CampaignInfoGroup label="원고료">
              <div className="w-full p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1 flex justify-between items-center">
                200,000 <span>원</span>
              </div>
            </CampaignInfoGroup>
          </div>

          {/* 제작 기간 */}
          <CampaignInfoGroup
            label="제작 기간"
            right={<img src={calendarIcon} alt="calendar" className="w-4 h-4" />}
          >
            <div className="flex items-center gap-2">
              <div className="flex-1 p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1">
                2025년 1월 20일
              </div>

              <span className="text-[var(--color-text-gray3)]">~</span>

              <div className="flex-1 p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1">
                2025년 1월 30일
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
    </div>
  );
}

/* 내부 공통 컴포넌트 */
function ContentItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-callout1 text-[var(--color-text-gray3)]">{label}</p>
      <div className="p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1 flex justify-between items-center">
        {value}
        <img src={arrowRightIcon} alt="arrow" className="w-4 h-4" />
      </div>
    </div>
  );
}
