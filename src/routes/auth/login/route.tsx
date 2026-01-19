import { createFileRoute } from "@tanstack/react-router";
import LoginContent from "./login-content";

export const Route = createFileRoute("/auth/login")({
  component: LoginContent,
});
