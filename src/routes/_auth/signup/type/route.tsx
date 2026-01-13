import { createFileRoute } from "@tanstack/react-router";
import SignUpTypeContent from "./signup-type-content";

export const Route = createFileRoute("/_auth/signup/type")({
  component: SignUpTypeContent,
});
