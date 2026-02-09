import { useParams } from "react-router-dom";
import ChattingRoom from "./chatting-room";

export default function RoomEntry() {
  console.log("params:", useParams());

  const { roomId } = useParams();
  const rid = Number(roomId);
  if (!Number.isFinite(rid) || rid <= 0) return null;
  return <ChattingRoom roomId={rid} />;
}
