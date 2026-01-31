import { useParams } from "react-router";
import { useState, useEffect } from "react";

import RealmatchHeader from "../../../components/common/RealmatchHeader";
import CampaignBrandCard from "../components/CampaignBrandCard";
import CampaignInfoGroup from "../components/CampaignInfoGroup";

import { getProposalDetail, type ProposalDetail } from "../../../data/campaign";

import editIcon from "../../../assets/icon-edit.svg";
import dropdownIcon from "../../../assets/arrow-down.svg";
import dropupIcon from "../../../assets/arrow-up.svg";
import arrowRightIcon from "../../../assets/icon/arrow-right.svg";
import calendarIcon from "../../../assets/icon-calender.svg";

export default function CampaignContent() {
  const { campaignId } = useParams();
  const [isContentOpen, setIsContentOpen] = useState(false);

  const [data, setData] = useState<ProposalDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("1. 현재 주소창에서 가져온 ID:", campaignId);
    if (campaignId) {
    setIsLoading(true);

    // --- 여기부터 가짜 데이터 ---
    const mockData: ProposalDetail = {
      proposalId: campaignId,
      brandId: 1,
      creatorId: 100,
      title: "비플레인 클렌징 및 세럼 리뷰 콘텐츠", // 화면에 나올 제목
      description: "비플레인의 가치가 제 채널과 잘 맞아서 제안드립니다.",
      rewardAmount: 200000,
      productId: 10,
      startDate: "2025-01-20",
      endDate: "2025-01-30",
      status: "검토 중",
      createdAt: "2025-01-15T10:00:00Z",
      contentTags: {
        formats: [{ id: "1", name: "인스타그램 릴스" }],
        categories: [{ id: "2", name: "뷰티" }],
        tones: [{ id: "3", name: "일상적인" }],
        involvements: [{ id: "4", name: "가이드 제공" }],
        usageRanges: [{ id: "5", name: "크리에이터 1차 활용" }],
      }
    };

    setData(mockData);
    setIsLoading(false);

    /*if (campaignId) {
      getProposalDetail(campaignId)
        .then((res) => {
          console.log("2. 서버에서 받은 진짜 데이터:", res);
          setData(res);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("3. API 호출 중 발생한 에러:", err);
          setIsLoading(false);
        });*/
    }
  }, [campaignId]);

  // 3. 로딩 중일 때 보여줄 화면
  if (isLoading) return <div className="p-10 text-center">로딩 중...</div>;
  if (!data) return <div className="p-10 text-center">데이터를 찾을 수 없습니다.</div>;

  // 태그들을 예쁘게 합쳐주는 함수 (예: ["릴스", "숏폼"] -> "릴스, 숏폼")
  const formatTags = (tags: { name: string }[]) => tags.map(t => t.name).join(", ");

  return (
    <div className="flex flex-col w-full min-h-screen bg-[var(--color-bluegray-1)]">
      {/* Header */}
      <RealmatchHeader title="캠페인 보기" showBack={true} />

      <main className="flex flex-col px-4 py-6 gap-6 pb-24">
        <CampaignBrandCard brandId={data.brandId} />

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
