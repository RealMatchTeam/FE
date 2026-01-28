import { createFileRoute } from "@tanstack/react-router";
import SignUpInfoMoreContent from "./signup-info-more-content";

type SignUpInfoMoreSearch = {
  type?: "email" | "social";
};

export const Route = createFileRoute("/_auth/signup/info-more")({
  component: SignUpInfoMoreContent,
  validateSearch: (search: Record<string, unknown>): SignUpInfoMoreSearch => {
    return {
      type: search.type === "social" ? "social" : "email",
    };
  },
});
