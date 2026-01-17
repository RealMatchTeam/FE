import { createFileRoute } from "@tanstack/react-router";
import SignUpSuccessContent from "./signup-success-content";

export const Route = createFileRoute("/_auth/signup/success")({
  component: SignUpSuccessContent,
});
