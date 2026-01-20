import { createFileRoute } from "@tanstack/react-router";
import SignUpTermsContent from "./signup-terms-content";

type SignUpTermsSearch = {
  type?: "email" | "social";
};

export const Route = createFileRoute("/auth/signup/terms")({
  component: SignUpTermsContent,
  validateSearch: (search: Record<string, unknown>): SignUpTermsSearch => {
    return {
      type: search.type === "social" ? "social" : "email",
    };
  },
});
