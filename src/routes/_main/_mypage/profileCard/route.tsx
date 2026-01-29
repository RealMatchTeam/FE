import { createFileRoute } from "@tanstack/react-router";
import ProfileCard from "./profileCard-content";

export const Route = createFileRoute("/_main/_mypage/profileCard")({
  component: ProfileCardRoute,
});

function ProfileCardRoute() {
  return <ProfileCard />;
}
