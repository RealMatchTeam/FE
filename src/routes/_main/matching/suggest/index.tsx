import { createFileRoute } from "@tanstack/react-router";
import MatchingSuggestContent from "./matching-suggest-content";

export const Route = createFileRoute("/_main/matching/suggest/")({
  component: MatchingSuggestContent,
});
