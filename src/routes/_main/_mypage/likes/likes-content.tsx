import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/_mypage/likes/likes-content')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/mypage/components/Likes"!</div>
}
