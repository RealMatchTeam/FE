import { useMatchResultStore } from "../../stores/matching-result";
import PreHome from "./home-content";
import HomeAfterMatch from "./home-after-match";

export default function Home() {
  const completed = useMatchResultStore((s) => Boolean(s.result?.completed));
  return completed ? <HomeAfterMatch /> : <PreHome />;
}
