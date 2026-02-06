import { useParams } from "react-router";
import ChattingRoom from "./chatting-room";

export default function RoomEntry() {
  const { chatId } = useParams();
  const brandId = Number(chatId);
  if (!Number.isFinite(brandId)) return null;
  return <ChattingRoom brandId={brandId} />;
}
