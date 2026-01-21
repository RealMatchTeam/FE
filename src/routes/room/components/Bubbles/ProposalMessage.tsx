import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/room/components/Bubbles/ProposalMessage',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/room/components/Bubbles/ProposalMessage"!</div>
}
