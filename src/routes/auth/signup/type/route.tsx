import { createFileRoute } from "@tanstack/react-router";
import SignUpTypeContent from "./signup-type-content";

type SignUpTypeSearch = {
  type?: "email" | "social";
};

export const Route = createFileRoute("/auth/signup/type")({
  component: SignUpTypeContent,
  validateSearch: (search: Record<string, unknown>): SignUpTypeSearch => {
    return {
      type: search.type === "social" ? "social" : "email",
    };
  },
});
