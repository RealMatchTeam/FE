import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { tokenStorage } from "../../lib/token";

export default function RoomsLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      navigate("/auth/login", { replace: true });
    }
  }, [navigate]);

  return <Outlet />;
}
