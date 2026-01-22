import { createFileRoute } from '@tanstack/react-router'
import ProposalContent from "./proposal-content";
export const Route = createFileRoute('/_main/_business/proposal')({
  component: ProposalContent,
})
