import { Outlet, useNavigate, useLocation } from "react-router";
import { useState, useEffect, useRef } from "react";
import BottomTab from "../components/layout/BottomTab";
import { LayoutContext } from "./layout-context";
import Logo from "../assets/logo/realmatch-logo-line.png";
import { tokenStorage } from "../lib/token";

export default function MainLayout() {
  const [hideBottomTab, setHideBottomTab] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [disableScroll, setDisableScroll] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // PWA 감지
  useEffect(() => {
    const checkPWA = () => {
      // display-mode: standalone 체크
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      // iOS Safari PWA 체크
      const isIOSPWA = (window.navigator as unknown as { standalone: boolean }).standalone === true;
      setIsPWA(isStandalone || isIOSPWA);
    };

    checkPWA();
  }, []);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

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
          <header className={`sticky top-0 z-50 w-full bg-white shrink-0 h-20 py-2.5 ${isPWA ? 'mt-10' : ''}`}>
            <div className="grid h-full w-full grid-cols-3 items-center">
              <div />
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex items-center justify-center"
              >
                <img alt="Real Match" draggable="false" src={Logo} />
              </button>
              <div />
            </div>
          </header>
        )}

        <main
          ref={mainRef}
          className={[
            "flex-1 w-full bg-gradient-to-b from-[#F6F6FF] via-[#F3F3FA] to-[#E8E8FB]",
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
