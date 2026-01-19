import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/_chat/chatting-room')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/_chat/chatting-room"!</div>
}
