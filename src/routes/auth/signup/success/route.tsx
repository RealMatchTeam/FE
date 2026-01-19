import { createFileRoute } from "@tanstack/react-router";
import SignUpSuccessContent from "./signup-success-content";

export const Route = createFileRoute("/auth/signup/success")({
  component: SignUpSuccessContent,
});
