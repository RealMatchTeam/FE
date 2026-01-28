import { createFileRoute } from "@tanstack/react-router";
import ChattingRoom from "./chatting-room";

export const Route = createFileRoute("/rooms/$chatId")({
  component: ChatRoomRoute,
});

function ChatRoomRoute() {
  const { chatId } = Route.useParams();
  return <ChattingRoom chatId={chatId} />;
}