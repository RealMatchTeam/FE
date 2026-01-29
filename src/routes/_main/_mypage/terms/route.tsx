import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/_mypage/terms')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/mypage/terms"!</div>
}
