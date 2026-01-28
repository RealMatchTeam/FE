import { createFileRoute } from "@tanstack/react-router";
import LoginContent from "./login-content";

export const Route = createFileRoute("/_auth/login")({
  component: LoginContent,
});
