import { createFileRoute } from "@tanstack/react-router";
import SignUpTermsContent from "./signup-terms-content";

export const Route = createFileRoute("/_auth/signup/terms")({
  component: SignUpTermsContent,
});
