import { createFileRoute, Outlet } from "@tanstack/react-router";
import BottomTab from "../components/layout/BottomTab";
import { createContext, useState } from "react";

type LayoutContextType = {
  hideBottomTab: boolean;
  setHideBottomTab: (v: boolean) => void;
};

export const LayoutContext = createContext<LayoutContextType | null>(null);

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
