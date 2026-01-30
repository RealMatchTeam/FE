import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/_mypage/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/mypage/edit"!</div>
}
