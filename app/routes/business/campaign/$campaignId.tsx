import { useParams, useNavigate, useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import CampaignBrandCard from "../components/CampaignBrandCard";
import CampaignInfoGroup from "../components/CampaignInfoGroup";
import { getProposalDetail, getAppliedCampaignDetail, type ProposalDetail, type AppliedCampaignDetail } from "../proposal/api/proposal";
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

  const campaignType = searchParams.get("type");
  const isApplied = campaignType === "applied-campaign";
  const isReceived = campaignType === "received-campaign";

  useHideHeader(true);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [data, setData] = useState<ProposalDetail | AppliedCampaignDetail | null>(null); // ProposalDetail | AppliedCampaignDetail
  const [brand, setBrand] = useState<BrandSummary | null>(null);

  useEffect(() => {
    console.log("1. 현재 주소창에서 가져온 ID:", campaignId);
    if (!campaignId) return;

    const loadData = async () => {
      try {
        let res;
        if (isApplied) {
          // 지원한 캠페인 API 호출
          res = await getAppliedCampaignDetail(campaignId);
        } else {
          // 보낸/받은 제안 API 호출
          res = await getProposalDetail(campaignId);
        }
        setData(res);

        if (res.brandId) {
          const brandResult = await getBrandSummary(Number(res.brandId));
          setBrand(brandResult);
        }
      } catch (err) {
        console.error("데이터 호출 에러:", err);
      }
    };

    loadData();
  }, [campaignId, isApplied]);

  if (!data) return <LoadingSpinner className="py-10" />;

  const getStatusLabel = (status: string) => {
    const MAP: Record<string, string> = {
      REVIEWING: "검토 중", MATCHED: "완료", REJECTED: "거절됨", CANCELED: "취소됨",
    };
    return MAP[status] || status;
  };

  const formatTags = (tags: { name: string }[]) => tags.map(t => t.name).join(", ");

  const proposalData = !isApplied ? (data as ProposalDetail) : null;
  const appliedData = isApplied ? (data as AppliedCampaignDetail) : null;

  //const isExistingCampaign = data.campaignId !== null && data.campaignId !== undefined;

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
  statusText={getStatusLabel(data.status)}
  brandName={brand?.brandName}
  brandTags={brand?.brandTags || []} 
  brandImageUrl={brand?.brandImageUrl}
  matchingRate={brand?.matchingRate}
  brandId={brand?.brandId || (data as any).brandId}
  category={proposalData?.contentTags?.categories?.[0]?.name || "beauty"}
/>

          <div className="flex justify-between items-center mt-5 mb-0">
            <div className="flex flex-col gap-1">
              <span className="text-title1 text-core-1">
                {isApplied ? "기존 캠페인" : (proposalData?.campaignId ? "기존 캠페인" : "신규 캠페인")}
              </span>
              <h2 className="text-title3 text-text-black">
                {/* 각 타입에 맞는 필드명을 조건부로 출력 */}
                {appliedData ? `‘${appliedData.campaignTitle}’` : (proposalData?.campaignId ? proposalData.campaignName : proposalData?.title)}
              </h2>
            </div>

            <button
              onClick={() => {/* 채팅 로직 */ }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#EBEEFB] rounded-[6px] border border-gray-100 active:scale-95 transition-all flex-shrink-0"
            >
              <img src={chatIcon} alt="chat" className="w-4 h-4" />
              <span className="text-[14px] text-[#5B5D6B] font-semibold">채팅하기</span>
            </button>
          </div>
        </div>

        {isApplied && appliedData ? (
          /* 1. 지원한 캠페인 뷰 */
          <div className="flex flex-col gap-6">
            <div className="bg-bluegray-1 px-4 py-6">
              <CampaignInfoGroup label="지원 이유">
                <div className="w-full p-5 bg-white border border-text-gray5 rounded-xl text-body1 min-h-[160px]">
                  {appliedData.campaignReason || "작성된 지원 이유가 없습니다."}
                </div>
              </CampaignInfoGroup>
            </div>
          </div>
        ) : proposalData ? (
          /* 2. 제안 뷰 (proposalData가 확실히 있을 때) */
          <div className="flex flex-col gap-6 px-4 py-6 bg-[var(--color-bluegray-1)]">
            {!isReceived && (
              <CampaignInfoGroup label="캠페인명">
                <div className="w-full p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1">
                  {proposalData.title}
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
                    {proposalData.description}
                  </div>
                </div>

                {/* dropdown 열렸을 때 */}
                {isContentOpen && proposalData.contentTags && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <ContentItem label="형식" value={formatTags(proposalData.contentTags.formats)} />
                    </div>
                    <ContentItem label="종류" value={formatTags(proposalData.contentTags.categories)} />
                    <ContentItem label="톤" value={formatTags(proposalData.contentTags.tones)} />
                    <ContentItem label="관여도" value={formatTags(proposalData.contentTags.involvements)} />
                    <ContentItem label="활용 범위" value={formatTags(proposalData.contentTags.usageRanges)} />
                  </div>
                )}
              </div>
            </CampaignInfoGroup>

            {/* 협찬품 / 원고료 */}
            <div className="grid grid-cols-2 gap-4">
              <CampaignInfoGroup label="협찬품">
                <div className="w-full p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1 flex justify-between items-center">
                  {proposalData.product || "상품 정보 없음"}
                  <img src={arrowRightIcon} alt="arrow" className="w-4 h-4" />
                </div>
              </CampaignInfoGroup>

              <CampaignInfoGroup label="원고료">
                <div className="w-full p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1 flex justify-between items-center">
                  {proposalData.rewardAmount?.toLocaleString()}<span>원</span>
                </div>
              </CampaignInfoGroup>
            </div>

            {/* 제작 기간 */}
            <CampaignInfoGroup label="제작 기간">
              <div className="flex items-center gap-2">
                <div className="flex-1 p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1">
                  {(proposalData.startDate || "").replace(/-/g, '. ')}
                </div>
                <span className="text-[var(--color-text-gray3)]">~</span>
                <div className="flex-1 p-4 bg-[var(--color-bg-w)] border border-[var(--color-text-gray5)] rounded-lg text-body1">
                  {(proposalData.endDate || "").replace(/-/g, '. ')}
                </div>
              </div>
            </CampaignInfoGroup>
          </div>
        ) : null}
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
