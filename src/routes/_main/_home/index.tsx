import { createFileRoute } from "@tanstack/react-router";
import HomeContent from "./indexContent";

export const Route = createFileRoute("/_main/_home/")({
  component: HomePage,
});

function HomePage() {
  return <HomeContent />;
}
