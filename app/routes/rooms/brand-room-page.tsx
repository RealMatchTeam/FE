import { useParams } from "react-router-dom";
import ChattingRoom from "./chatting-room"; // 실제 파일명에 맞게

export default function BrandRoomPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const id = Number(brandId);
  if (!Number.isFinite(id)) return null;
  return <ChattingRoom brandId={id} />;
}
