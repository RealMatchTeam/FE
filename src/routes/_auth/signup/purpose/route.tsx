import { createFileRoute } from "@tanstack/react-router";
import SignUpPurposeContent from "./signup-purpose-content";

type SignUpPurposeSearch = {
  type?: "email" | "social";
};

export const Route = createFileRoute("/_auth/signup/purpose")({
  component: SignUpPurposeContent,
  validateSearch: (search: Record<string, unknown>): SignUpPurposeSearch => {
    return {
      type: search.type === "social" ? "social" : "email",
    };
  },
});
