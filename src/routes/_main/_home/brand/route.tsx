import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/_home/brand")({
  component: BrandLayout,
});

function BrandLayout() {
  return <Outlet />;
}
