import { createFileRoute, Outlet } from "@tanstack/react-router";
import BottomTab from "./_main/components/BottomTab";
import { useState } from "react";
import { LayoutContext } from "./_main/layout-context";
import Logo from "../assets/logo/RealMatchLogo_ex.svg";

export const Route = createFileRoute("/_main")({
  component: MainLayout,
});

function MainLayout() {
  const [hideBottomTab, setHideBottomTab] = useState(false);

  return (
    <LayoutContext.Provider value={{ hideBottomTab, setHideBottomTab }}>
      <div className="flex flex-col w-full h-screen bg-white overflow-hidden">
        <header className="w-full bg-white shrink-0 py-4.5">
          <div className="grid h-full w-full grid-cols-3 items-center">
            <div className="flex items-center"></div>
            <div className="flex items-center justify-center">
              <img alt="Real Match" draggable="false" src={Logo} />
            </div>
          </div>
        </header>

        <main className="flex-1 w-full bg-[#FAFAFA] overflow-y-auto">
          <Outlet />
        </main>

        {!hideBottomTab && <BottomTab />}
      </div>
    </LayoutContext.Provider>
  );
}
