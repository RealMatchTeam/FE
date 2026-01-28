import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/mypage/notifications')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/mypage/notifications"!</div>
}
