import { useSearchParams } from "react-router";
import CampaignContent from "./campaign-content";

export default function CampaignRoute() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  return <CampaignContent key={type} />;
}
