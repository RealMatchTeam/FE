import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Button from "../../../components/common/Button";

import CampaignBrandCard from "../components/CampaignBrandCard";
import CampaignInfoGroup from "../components/CampaignInfoGroup";

import { type ProposalDetail, getProposalDetail } from "../../../data/campaign";

import editIcon from "../../../assets/icon-edit.svg";
import dropdownIcon from "../../../assets/arrow-down.svg";
import dropupIcon from "../../../assets/arrow-up.svg";
import arrowRightIcon from "../../../assets/icon/arrow-right.svg";
import calendarIcon from "../../../assets/icon-calender.svg";

export default function CampaignContent() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [isContentOpen, setIsContentOpen] = useState(false);

  const [data, setData] = useState<ProposalDetail | null>(null);

  useEffect(() => {
    console.log("1. 현재 주소창에서 가져온 ID:", campaignId);
    if (!campaignId) return;

    const loadData = async () => {
      try {
        const res = await getProposalDetail(campaignId);
        console.log("2. 서버에서 받은 데이터:", res);
        setData(res);
      } catch (err) {
        console.error("3. API 호출 중 발생한 에러:", err);
      }
    };

    loadData();
  }, [campaignId]);

  if (!data) return <div className="p-10 text-center">로딩 중...</div>;

  const formatTags = (tags: { name: string }[]) => tags.map(t => t.name).join(", ");

  return (
    <div className="flex flex-col w-full min-h-screen bg-[var(--color-bluegray-1)]">
      {/* Header */}
      <header className="h-[56px] w-full bg-white border-b border-gray-100">
        <div className="relative flex items-center justify-center h-full px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-4 flex items-center justify-center"
            aria-label="뒤로가기"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M17 3L8 12L17 21" stroke="#5B5D6B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <h1 className="text-title1 text-text-black">캠페인 보기</h1>
        </div>
      </header>

      <main className="flex flex-col px-4 py-6 gap-6 pb-24">
        <CampaignBrandCard showChatSection={false} statusText={data.status} />

        <div className="flex flex-col gap-5">
          {/* 캠페인명 */}
          <CampaignInfoGroup
            label="캠페인명"
            right={<img src={editIcon} alt="edit" className="w-4 h-4" />}
          >
            <div className="w-full p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1">
              {data.title}
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
                  {data.description} {/* data.description으로 변경 */}
                </div>
              </div>

              {/* dropdown 열렸을 때 */}
              {isContentOpen && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <ContentItem label="형식" value={formatTags(data.contentTags.formats)} />
                  </div>

                  <ContentItem label="종류" value={formatTags(data.contentTags.categories)} />
                  <ContentItem label="톤" value={formatTags(data.contentTags.tones)} />
                  <ContentItem label="관여도" value={formatTags(data.contentTags.involvements)} />
                  <ContentItem label="활용 범위" value={formatTags(data.contentTags.usageRanges)} />
                </div>
              )}
            </div>
          </CampaignInfoGroup>

          {/* 협찬품 / 원고료 */}
          <div className="grid grid-cols-2 gap-4">
            <CampaignInfoGroup label="협찬품">
              <div className="w-full p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1 flex justify-between items-center">
                상품 ID: {data.productId}
                <img src={arrowRightIcon} alt="arrow" className="w-4 h-4" />
              </div>
            </CampaignInfoGroup>

            <CampaignInfoGroup label="원고료">
              <div className="w-full p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1 flex justify-between items-center">
                {data.rewardAmount.toLocaleString()}<span>원</span>
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
                {data.startDate.replace(/-/g, '. ')}
              </div>

              <span className="text-[var(--color-text-gray3)]">~</span>

              <div className="flex-1 p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1">
                {data.endDate.replace(/-/g, '. ')}
              </div>
            </div>
          </CampaignInfoGroup>

          {/* 기타 협의 사항 */}
          <CampaignInfoGroup
            label="기타 협의 사항"
            right={<img src={editIcon} alt="edit" className="w-4 h-4" />}
          >
            <div className="w-full p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1 text-[var(--color-text-gray3)]">
              {data.refusalReason || "기타 협의 사항이 없습니다."}
            </div>
          </CampaignInfoGroup>
        </div>
      </main>

      <div className="sticky bottom-0 left-0 right-0 p-5 bg-white border-t border-bluegray-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate("/matching/suggest/create?type=existing", { state: { campaign: data } })}
        >
          제안하기
        </Button>
      </div>
    </div >
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
