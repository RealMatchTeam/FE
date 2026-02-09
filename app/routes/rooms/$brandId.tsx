import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { tokenStorage } from "../../lib/token";
import { createOrGetDirectRoom } from "./api/rooms";
import NavigationHeader from "../../components/common/NavigateHeader";

export default function BrandEntry() {
  const navigate = useNavigate();
  const { brandId } = useParams();

  const bid = Number(brandId);
  const myUserId = Number(tokenStorage.getUserId() ?? 0);
  const token = tokenStorage.getAccessToken();

  useEffect(() => {
    if (!token) {
      navigate("/auth/login", { replace: true });
      return;
    }
    if (!Number.isFinite(bid) || bid <= 0) return;
    if (!Number.isFinite(myUserId) || myUserId <= 0) return;

    const run = async () => {
      try {
        const { roomId } = await createOrGetDirectRoom({
          brandId: bid,
          creatorId: myUserId,
        });
        console.log(roomId);
        navigate(`/rooms/${roomId}`, { replace: true });
      } catch (e) {
        console.error(e);
      }
    };

    run();
  }, [token, bid, myUserId, navigate]);

  return (
    <div className="h-screen-full bg-white">
      <NavigationHeader title="채팅" onBack={() => history.back()} />
      <div className="p-6 text-text-gray3">채팅방을 여는 중...</div>
    </div>
  );
}
