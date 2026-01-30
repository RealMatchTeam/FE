import { createFileRoute } from 'react-router'

export const Route = createFileRoute('/_main/mypage/inquiry')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/mypage/inquiry"!</div>
}
