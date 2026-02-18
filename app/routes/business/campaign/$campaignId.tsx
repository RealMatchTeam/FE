import { useParams, useNavigate, useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import CampaignBrandCard from "../components/CampaignBrandCard";
import CampaignInfoGroup from "../components/CampaignInfoGroup";
import { getProposalDetail, type ProposalDetail } from "../proposal/api/proposal";
import { useHideHeader } from "../../../hooks/useHideHeader";
import { getBrandSummary, type BrandSummary } from "../proposal/api/brand";

import dropdownIcon from "../../../assets/arrow-down.svg";
import dropupIcon from "../../../assets/arrow-up.svg";
import arrowRightIcon from "../../../assets/icon/arrow-right.svg";
import chatIcon from "../../../assets/chat-icon.svg"; // 채팅 아이콘 경로 확인 필요

export default function CampaignContent() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isReceived = searchParams.get("type") === "received-campaign";

  useHideHeader(true);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [data, setData] = useState<ProposalDetail | null>(null);
  const [brand, setBrand] = useState<BrandSummary | null>(null);

  useEffect(() => {
    console.log("1. 현재 주소창에서 가져온 ID:", campaignId);
    if (!campaignId) return;

    const loadData = async () => {
      try {
        const res = await getProposalDetail(campaignId);
        setData(res);

        if (res.brandId) {
          const brandResult = await getBrandSummary(res.brandId);
          setBrand(brandResult);
        }
      } catch (err) {
        console.error("데이터 호출 에러:", err);
      }
    };

    loadData();
  }, [campaignId]);

  if (!data) return <LoadingSpinner className="py-10" />;

  const STATUS_TEXT_MAP: Record<string, string> = {
    REVIEWING: "검토 중",
    MATCHED: "매칭 완료",
    REJECTED: "거절됨",
    CANCELED: "취소됨",
  };

  const formatTags = (tags: { name: string }[]) => tags.map(t => t.name).join(", ");

  const isExistingCampaign = data.campaignId !== null && data.campaignId !== undefined;

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 h-[56px] w-full bg-white border-b border-gray-100">
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

      <main className="flex flex-col pb-24 gap-6">
        
        {/* 상단 통합 영역: 브랜드 카드 + 캠페인 제목 + 채팅하기 */}
        <div className="flex flex-col bg-white px-4 pt-6 pb-2">
          <CampaignBrandCard 
            showChatSection={false} 
            statusText={STATUS_TEXT_MAP[data.status] || data.status}
            brandName={brand?.brandName}
            brandTags={brand?.brandTags || []}
            brandImageUrl={brand?.brandImageUrl}
            matchingRate={brand?.matchingRate}
            brandId={brand?.brandId || data.brandId}
            category={data.contentTags.categories[0]?.name || "beauty"}
          />

          <div className="flex justify-between items-center mt-5 mb-0">
            <div className="flex flex-col gap-1">
              <span className="text-title1 text-core-1">
                {isExistingCampaign ? "기존 캠페인" : "신규 캠페인"}
              </span>
              <h2 className="text-title3 text-text-black leading-tight">
                {isExistingCampaign ? data.campaignName : data.title}
              </h2>
            </div>
            
            <button 
              onClick={() => {/* 채팅 로직 */}}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#EBEEFB] rounded-[6px] border border-gray-100 active:scale-95 transition-all flex-shrink-0"
            >
              <img src={chatIcon} alt="chat" className="w-4 h-4" />
              <span className="text-[14px] text-[#5B5D6B] font-semibold">채팅하기</span>
            </button>
          </div>
        </div>
        
        <div className="flex flex-col gap-6 px-4 py-6 bg-[var(--color-bluegray-1)]">
          {!isReceived && (
            <CampaignInfoGroup label="캠페인명">
              <div className="w-full p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1">
                {data.title}
              </div>
            </CampaignInfoGroup>
          )}

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
                {data.product || "상품 정보 없음"}
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
          >
            <div className="flex items-center gap-2">
              <div className="flex-1 p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1">
                {(data?.startDate || "").replace(/-/g, '. ')}
              </div>

              <span className="text-[var(--color-text-gray3)]">~</span>

              <div className="flex-1 p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1">
                 {(data?.endDate || "").replace(/-/g, '. ')}
              </div>
            </div>
          </CampaignInfoGroup>
        </div>
      </main>
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
