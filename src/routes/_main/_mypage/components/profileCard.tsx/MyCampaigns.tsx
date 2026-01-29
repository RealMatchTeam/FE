import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_main/_mypage/components/profileCard/tsx/MyCampaigns',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/_main/mypage/components/profileCard/tsx/MyCampaigns"!</div>
  )
}
