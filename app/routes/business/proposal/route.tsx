import { useSearchParams } from "react-router";
import ProposalContent from "./sent-proposal-content";
import ReceivedProposalContent from "./received-proposal-content";

export default function Proposal() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "sent";

  if (type === "received") {
    return <ReceivedProposalContent />;
  }

  return <ProposalContent />;
}
