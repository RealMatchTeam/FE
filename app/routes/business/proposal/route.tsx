import { useSearchParams } from "react-router";
import ProposalContent from "./sent-proposal-content";
import ReceivedProposalContent from "./received-proposal-content";
import ApplicationContent from "./application-content";

export default function Proposal() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "sent";

  if (type === "received") {
    return <ReceivedProposalContent />;
  }

  if (type === "applied") {
    return <ApplicationContent />;
  }

  return <ProposalContent />;
}
