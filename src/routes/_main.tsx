import { createFileRoute, Outlet } from "@tanstack/react-router";
import BottomTab from "./_main/components/BottomTab";
import { useState } from "react";
import { LayoutContext } from "./_main/layout-context";

export const Route = createFileRoute("/_main")({
  component: MainLayout,
});

function MainLayout() {
  const [hideBottomTab, setHideBottomTab] = useState(false);

  return (
    <LayoutContext.Provider value={{ hideBottomTab, setHideBottomTab }}>
      <div className={`min-h-screen bg-white ${hideBottomTab ? "pb-0" : "pb-16"}`}>
        <Outlet />
        {!hideBottomTab && <BottomTab />}
      </div>
    </LayoutContext.Provider>
  );

}
