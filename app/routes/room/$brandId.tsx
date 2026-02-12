import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { tokenStorage } from "../../lib/token";
import { createOrGetDirectRoom } from "./api/rooms";
import NavigationHeader from "../../components/common/NavigateHeader";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

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
      <div className="flex items-center justify-center h-[calc(100vh-60px)]">
        <DotLottieReact
          src="https://lottie.host/3f73ad11-39f7-41fd-84be-0df60e3ff73d/VFk3FfaUJV.lottie"
          loop
          autoplay
          className="w-40 h-auto"
        />
      </div>
    </div>
  );
}
