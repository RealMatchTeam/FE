import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/_home/campaign/")({
  validateSearch: (search: Record<string, unknown>) => {
    const campaignId =
      typeof search.campaignId === "string" ? search.campaignId : "c1";
    return { campaignId };
  },
  component: CampaignDetailPage,
});

function CampaignDetailPage() {
  const { campaignId } = Route.useSearch();

  // TODO: 나중에 react-query로 API 연동
  return (
    <div className="min-h-screen bg-white px-5 py-6">
      <div className="text-[16px] font-semibold text-black">캠페인 상세</div>
      <div className="mt-2 text-[13px] text-black/50">
        campaignId: {campaignId}
      </div>
    </div>
  );
}
