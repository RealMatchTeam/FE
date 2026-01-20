import brandLogo from "../../../../assets/brand-logo.png";
import chatIcon from "../../../../assets/chat-icon.svg";

export default function CampaignBrandCard() {
  return (
    <section className="bg-white p-5 flex flex-col gap-4 -mx-4 -mt-6">
      {/* 상단 브랜드 정보 */}
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          {/* 브랜드 로고 */}
          <div className="w-[64px] h-[64px] flex items-center justify-center overflow-hidden">
            <img
              src={brandLogo}
              alt="beplain"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-[16px] font-bold text-[#222]">비플레인</h2>
            <p className="text-[12px] text-[#9B9BA1]">
              #저자극 #천연재료 #민감성피부
            </p>
          </div>
        </div>

        {/* 매칭률 */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] font-medium text-[#6666E5]">
              매칭률
            </span>
            <span className="text-[16px] font-bold text-[#6666E5]">
              99%
            </span>
          </div>
          <button className="text-[12px] text-[#6666E5]">
            보낸 제안
          </button>
        </div>
      </div>

      {/* 하단 캠페인 정보 */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex flex-col">
          <span className="text-[16px] font-bold text-[#6666E5] mb-1">
            신규 캠페인
          </span>
          <h1 className="text-[14px] font-bold text-[#222]">
            비플레인 클렌징 및 세럼 리뷰
          </h1>
        </div>

        {/* 채팅 버튼 */}
        <button className="flex items-center gap-2 px-4 py-2 bg-[#F0F0FF] rounded-lg text-[#6666E5] text-[14px] font-semibold active:opacity-70">
          <img
            src={chatIcon}
            alt="chat"
            className="w-[16px] h-[16px]"
          />
          채팅하기
        </button>
      </div>
    </section>
  );
}
