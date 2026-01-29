import { useNavigate } from "@tanstack/react-router";
import MyPageHome from "./MyPageHome";
import { useAuthStore } from "../../../../stores/auth-store";

export default function MyPageContent() {
  const navigate = useNavigate();
  const me = useAuthStore((s) => s.me);

  const hasMatchingTest = Boolean(me?.matchingTestDone);

  return (
    <>
      <MyPageHome
        hasMatchingTest={hasMatchingTest}
        user={{
          name: me?.name ?? "비비",
          roleText: me?.roleText ?? "홍길동",
          email: me?.email ?? "yeahsel0608@cau.ac.kr",
          avatarUrl: me?.avatarUrl ?? "/images/default-avatar.png",
        }}
        onGoMatchingTest={() => navigate({ to: "/matching/test/step1" })}
        onOpenProfileCard={() => navigate({ to: "/profileCard" })}
        onOpenLikes={() => navigate({ to: "/likes" })}
        onOpenEditProfile={() => navigate({ to: "/edit" })}
        onOpenNotifications={() => navigate({ to: "/notifications" })}
        onOpenInquiry={() => {}}
        onOpenTerms={() => navigate({ to: "/terms" })} // policy/terms
        onOpenPrivacy={() => navigate({ to: "/privacy" })} // policy/privacy
        onLogout={() => {
          useAuthStore.getState().logout?.();
          navigate({ to: "/login" });
        }}
        onWithdraw={() => {}}
      />
    </>
  );
}
