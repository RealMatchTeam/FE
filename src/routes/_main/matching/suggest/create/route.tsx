import { createFileRoute } from "@tanstack/react-router";
import CreateCampaignContent from "./create-campaign-content";

export const Route = createFileRoute("/_main/matching/suggest/create")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      type: (search.type as "new" | "existing") || "new",
    };
  },
  component: CreateCampaignContent,
});
