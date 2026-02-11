import { Outlet, useLocation } from "react-router";
import ChatPage from "./page";

export default function Chat() {
  const location = useLocation();
  const isIndex = location.pathname === "/chat" || location.pathname === "/chat/";

  return isIndex ? <ChatPage /> : <Outlet />;
}
