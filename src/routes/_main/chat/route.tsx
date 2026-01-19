import { createFileRoute } from "@tanstack/react-router";
import ChatPage from "./chat-content";

export const Route = createFileRoute("/_main/chat")({
  component: ChatPage,
});
