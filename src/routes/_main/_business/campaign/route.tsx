// src/routes/_main/_business/campaign/route.tsx
import { createFileRoute } from "@tanstack/react-router";
import CampaignContent from "./campaign-content";

export const Route = createFileRoute("/_main/_business/campaign")({
  component: CampaignContent,
});
