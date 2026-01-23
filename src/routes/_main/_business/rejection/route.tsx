import { createFileRoute } from '@tanstack/react-router'
import RejectionContent from "./rejection-content";
export const Route = createFileRoute('/_main/_business/rejection')({
  component:RejectionContent,
})
