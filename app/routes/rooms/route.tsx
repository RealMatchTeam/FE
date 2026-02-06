import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { tokenStorage } from "../../lib/token";
import { useAuthStore } from "../../stores/auth-store";

type RoomsNavState = {
  creatorId?: number;
  brandId?: number;
};

export default function RoomsLayout() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: RoomsNavState | null };

  const setMe = useAuthStore((s) => s.setMe);

  useEffect(() => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      navigate("/auth/login", { replace: true });
      return;
    }

    if (state?.creatorId) {
      setMe({ id: String(state.creatorId) });
    }
  }, [navigate, setMe, state?.creatorId]);

  return <Outlet />;
}
