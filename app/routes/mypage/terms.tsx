import { createFileRoute } from 'react-router'

export const Route = createFileRoute('/_main/mypage/terms')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/mypage/terms"!</div>
}
