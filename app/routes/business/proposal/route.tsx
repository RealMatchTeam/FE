import { useSearchParams } from "react-router";
import ProposalContent from "./sent-proposal-content";
import ReceivedProposalContent from "./received-proposal-content";
import ApplicationContent from "./application-content";
import SentCampaignContent from "./sent-campaign-content";
import ReceivedCampaignContent from "./received-campaign-content";

export default function Proposal() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "sent";

  if (type === "received") {
    return <ReceivedProposalContent />;
  }

  if (type === "applied") {
    return <ApplicationContent />;
  }

  if (type === "sent-campaign") {
    return <SentCampaignContent />;
  }

  if (type === "received-campaign") {
    return <ReceivedCampaignContent />;
  }

  return <ProposalContent />;
}
