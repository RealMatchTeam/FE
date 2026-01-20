import { createFileRoute, useRouter } from "@tanstack/react-router";
import Header from "../../components/layout/Header";
import CampaignBrandCard from "./components/CampaignBrandCard";
import CampaignInfoGroup from "./components/CampaignInfoGroup";

export const Route = createFileRoute("/_business/campaign")({
  component: CampaignDetailPage,
});

function CampaignDetailPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#F7F8FA]">
      <Header title="캠페인 보기" showBackButton onBack={() => router.history.back()} />

      <main className="flex flex-col px-4 py-6 gap-6 pb-24">
        <CampaignBrandCard />

        <div className="flex flex-col gap-5">
          <CampaignInfoGroup label="캠페인명" icon="✏️">
            <div className="w-full p-4 bg-white border border-gray-100 rounded-lg text-[14px]">
              비플레인 클렌징 및 세럼 리뷰 콘텐츠
            </div>
          </CampaignInfoGroup>

          <CampaignInfoGroup label="캠페인 내용" isDropdown>
            <div className="flex flex-col gap-2">
              <p className="text-[13px] font-semibold text-[#9B9BA1]">설명</p>
              <div className="w-full p-4 bg-white border border-gray-100 rounded-lg text-[14px] leading-relaxed">
                안녕하세요 크리에이터 비비 입니다! 비플레인의 가치가 제 채널에서 소개하는...
              </div>
            </div>
          </CampaignInfoGroup>

          <div className="grid grid-cols-2 gap-4">
            <CampaignInfoGroup label="협찬품">
              <div className="w-full p-4 bg-white border border-gray-100 rounded-lg text-[14px] flex justify-between">
                글로우 크림 1개 <span className="text-gray-400">〉</span>
              </div>
            </CampaignInfoGroup>
            <CampaignInfoGroup label="원고료">
              <div className="w-full p-4 bg-white border border-gray-100 rounded-lg text-[14px] flex justify-between">
                200,000 <span>원</span>
              </div>
            </CampaignInfoGroup>
          </div>
          
          {/* ... 나머지 섹션 생략 */}
        </div>
      </main>
    </div>
  );
}