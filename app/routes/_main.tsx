import { Outlet, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import BottomTab from "../components/layout/BottomTab";
import { LayoutContext } from "./layout-context";
import Logo from "../assets/logo/RealMatchLogo_ex.svg";
import { tokenStorage } from "../lib/token";

export default function MainLayout() {
  const [hideBottomTab, setHideBottomTab] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [disableScroll, setDisableScroll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      navigate("/auth/login");
    }
  }, [navigate]);

  return (
    <LayoutContext.Provider
      value={{
        hideBottomTab,
        setHideBottomTab,
        hideHeader,
        setHideHeader,
        disableScroll,
        setDisableScroll,
      }}
    >
      <div className="flex flex-col w-full h-screen bg-white overflow-hidden">
        {!hideHeader && (
          <header className="w-full bg-white shrink-0 py-4.5">
            <div className="grid h-full w-full grid-cols-3 items-center">
              <div />
              <div className="flex items-center justify-center">
                <img alt="Real Match" draggable="false" src={Logo} />
              </div>
              <div />
            </div>
          </header>
        )}

        <main
          className={[
            "flex-1 w-full bg-[#FAFAFA]",
            disableScroll ? "overflow-hidden" : "overflow-y-auto",
          ].join(" ")}
        >
          <Outlet />
        </main>

        {!hideBottomTab && <BottomTab />}
      </div>
    </LayoutContext.Provider>
  );
}
