import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/_home/campaign/")({
  validateSearch: (search: Record<string, unknown>) => ({
    campaignId: typeof search.campaignId === "string" ? search.campaignId : "",
  }),
  component: CampaignTempDetail,
});

function CampaignTempDetail() {
  const { campaignId } = Route.useSearch();
  return (
    <div className="min-h-screen bg-white px-5 py-6">
      <div className="text-[16px] font-semibold">캠페인 상세(임시)</div>
      <div className="mt-2 text-[13px] text-text-gray3">
        campaignId: {campaignId || "(없음)"}
      </div>
    </div>
  );
}
