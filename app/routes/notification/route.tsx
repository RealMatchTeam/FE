import { Outlet } from "react-router-dom";
import NotificationContent from "./notification-content";

export default function NotificationLayout() {
  return (
    <div>
      <NotificationContent />
      <Outlet /> 
    </div>
  );
}