import { createFileRoute } from "@tanstack/react-router";
import { useMatchResultStore } from "../../../stores/matching-result";

import PreHome from "./home-content"; // ✅ 매칭 전 홈 (네 파일명 유지)
import HomeAfterMatch from "./home-after-match"; // ✅ 매칭 후 홈

export const Route = createFileRoute("/_main/_home/")({
  component: HomeGate,
});

function HomeGate() {
  const completed = useMatchResultStore((s) => Boolean(s.result?.completed));
  return completed ? <HomeAfterMatch /> : <PreHome />;
}
