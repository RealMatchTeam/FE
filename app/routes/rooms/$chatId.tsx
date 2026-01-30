import { useParams } from "react-router";
import ChattingRoom from "./chatting-room";

export default function ChatRoomRoute() {
  const { chatId } = useParams();
  return <ChattingRoom chatId={chatId!} />;
}
