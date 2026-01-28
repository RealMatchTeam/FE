import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/mypage/withdraw')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/mypage/withdraw"!</div>
}
