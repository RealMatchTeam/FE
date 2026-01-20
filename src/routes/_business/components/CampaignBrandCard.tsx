export default function CampaignBrandCard() {
  return (
    <section className="bg-white p-5 rounded-xl shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className="w-[60px] h-[60px] border border-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            <img src="/brand-logo.png" alt="beplain" className="w-full h-auto" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-[18px] font-bold text-[#222]">비플레인</h2>
            <p className="text-[13px] text-[#9B9BA1]">#저자극 #천연재료 #민감성피부</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[14px] font-bold text-[#6666E5]">매칭률 99%</span>
          <button className="text-[12px] text-[#9B9BA1] underline">보낸 제안</button>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <div className="flex flex-col">
          <span className="text-[14px] font-bold text-[#6666E5] mb-1">신규 캠페인</span>
          <h1 className="text-[16px] font-bold text-[#222]">비플레인 클렌징 및 세럼 리뷰</h1>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#F0F0FF] rounded-lg text-[#6666E5] text-[14px] font-semibold active:opacity-70">
          <span className="text-[16px]">💬</span> 채팅하기
        </button>
      </div>
    </section>
  );
}