import { createFileRoute, Outlet } from "@tanstack/react-router";
import BottomTab from "../components/layout/BottomTab";

export const Route = createFileRoute("/_main")({
  component: MainLayout,
});

function MainLayout() {
  return (
    <div className="min-h-screen bg-white pb-16">
      <Outlet />
      <BottomTab />
    </div>
  );
}
