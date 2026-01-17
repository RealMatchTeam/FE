import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_chat/components/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_chat/components/test"!</div>
}
