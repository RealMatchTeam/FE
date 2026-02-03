import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import MobileContainer from "../components/layout/MobileContainer";

function RootLayout() {
  return (
    <MobileContainer>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </MobileContainer>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});
