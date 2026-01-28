import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/mypage/likes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/mypage/components/Likes"!</div>
}
