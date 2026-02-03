import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/_home/campaign")({
  component: CampaignLayout,
});

function CampaignLayout() {
  return <Outlet />;
}
