import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_matchingTest/matchingTest")({
  component: MatchingTestLayout,
});

function MatchingTestLayout() {
  return <Outlet />;
}
