import brandLogo from "../../../assets/brand-logo.png";
import chatIcon from "../../../assets/chat-icon.svg";
import arrowRightIcon from "../../../assets/icon/arrow-right.svg";

interface CampaignBrandCardProps {
  showChatSection?: boolean; // 채팅 섹션 표시 여부
  statusText?: string;      // '보낸 제안' 또는 '검토 중'
}

export default function CampaignBrandCard({ 
  showChatSection = true, 
  statusText = "보낸 제안" 
}: CampaignBrandCardProps) {
  return (
    <section className="bg-bg-w p-5 flex flex-col gap-4 -mx-4 -mt-6">
      {/* 상단 브랜드 정보 */}
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          {/* 브랜드 로고 박스 */}
          <div className="w-[64px] h-[64px] flex items-center justify-center overflow-hidden border border-text-gray5 rounded-lg">
            <img
              src={brandLogo}
              alt="beplain"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <h2 className="text-title1 text-text-black">비플레인</h2>
              <img src={arrowRightIcon} alt="arrow"/>
            </div>
            <p className="text-callout1 text-text-gray3 mt-3">
              #저자극 #천연재료 #민감성피부
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-title5 text-core-1">매칭률</span>
            <span className="text-title6 text-core-1">99%</span>
          </div>
          <span className="text-callout1 text-core-1 mt-3">{statusText}</span>
        </div>
      </div>

      {/* 하단 캠페인 정보 및 채팅 버튼 (showChatSection이 true일 때만 표시) */}
      {showChatSection && (
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-title1 text-core-1 mb-1">
              신규 캠페인
            </span>
            <h1 className="text-title3 text-text-black">
              비플레인 클렌징 및 세럼 리뷰
            </h1>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-bluegray-2 rounded-lg text-core-1 text-caption1 active:opacity-70 transition-opacity">
            <img src={chatIcon} alt="chat" className="w-[16px] h-[16px]" />
            채팅하기
          </button>
        </div>
      )}
    </section>
  );
}