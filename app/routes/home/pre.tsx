import { createFileRoute } from "react-router";
import HomeContent from "./home-content";

export const Route = createFileRoute("/_main/_home/pre")({
  component: HomePage,
});

function HomePage() {
  return <HomeContent />;
}
