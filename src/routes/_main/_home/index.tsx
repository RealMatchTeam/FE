import { createFileRoute } from "@tanstack/react-router";
import HomeContent from "./home-content";

export const Route = createFileRoute("/_main/_home/")({
  component: HomePage,
});

function HomePage() {
  return <HomeContent />;
}
