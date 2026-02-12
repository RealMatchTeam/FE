import { Outlet, useNavigate, useLocation } from "react-router";
import { useState, useEffect, useRef } from "react";
import BottomTab from "../components/layout/BottomTab";
import { LayoutContext } from "./layout-context";
import Logo from "../assets/logo/realmatch-logo-line.png";
import bellIcon from "../assets/icon/icon-bell.svg";
import redDot from "../assets/icon/red-dot.svg";
import { tokenStorage } from "../lib/token";
import { fetchUnreadCount } from "../routes/notification/api/notification";

export default function MainLayout() {
  const [hideBottomTab, setHideBottomTab] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [disableScroll, setDisableScroll] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  const updateUnreadCount = async () => {
    try {
      const data = await fetchUnreadCount();
      if (data.isSuccess) {
        setUnreadCount(data.result.count);
      }
    } catch (error) {
      console.error("미읽음 알림 조회 실패:", error);
    }
  };

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
  }, [location.pathname, location.search]);

  useEffect(() => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      navigate("/auth/login");
    }
  }, [navigate]);

  useEffect(() => {
    const accessToken = tokenStorage.getAccessToken();
    if (accessToken) {
      updateUnreadCount(); // 로그인 상태면 개수 조회
    }
  }, [location.pathname]); 

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
          <header className={`sticky top-0 z-50 w-full bg-white shrink-0 h-15 py-2 ${isPWA ? 'mt-10' : ''}`}>
            <div className="grid h-full w-full grid-cols-3 items-center">
              <div />
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex items-center justify-center"
              >
                <img alt="Real Match" draggable="false" src={Logo} />
              </button>
              <div className="flex items-center justify-end pr-4">
                <button
                  type="button"
                  onClick={() => navigate("/notification")}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full active:bg-black/5"
                  aria-label="알림"
                >
                  <img
                    src={bellIcon}
                    alt="알림"
                    className="w-6 h-6 object-contain"
                  />
                  {unreadCount > 0 && (
                  <img
                    src={redDot}
                    alt=""
                    className="absolute top-[8px] right-[8px] w-2 h-2"
                  />
                )}
                </button>
              </div>
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
