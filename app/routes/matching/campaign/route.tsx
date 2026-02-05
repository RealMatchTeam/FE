import { useSearchParams } from "react-router";
import CampaignContent from "./campaign-content";
import CampaignMatchingErrorBoundary from "./error-boundary";

export default function CampaignRoute() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  return <CampaignContent key={type} />;
}

export const ErrorBoundary = CampaignMatchingErrorBoundary;
