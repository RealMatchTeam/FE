import { useParams } from "react-router";
import ChattingRoom from "./chatting-room";

export default function ChatRoomRoute() {
  const { chatId } = useParams();

  const roomId = Number(chatId);
  if (!chatId || Number.isNaN(roomId)) {
    return null;
  }
  return <ChattingRoom roomId={roomId} />;
}
