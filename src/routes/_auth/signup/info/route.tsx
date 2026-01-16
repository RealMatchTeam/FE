import { createFileRoute } from "@tanstack/react-router";
import SignUpInfoContent from "./signup-info-content";

type SignUpInfoSearch = {
  type?: "email" | "social";
};

export const Route = createFileRoute("/_auth/signup/info")({
  component: SignUpInfoContent,
  validateSearch: (search: Record<string, unknown>): SignUpInfoSearch => {
    return {
      type: search.type === "social" ? "social" : "email",
    };
  },
});
