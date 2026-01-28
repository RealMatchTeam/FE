import { useNavigate } from "@tanstack/react-router";
import MyPageHome from "./MyPageHome";
import { useAuthStore } from "../../../stores/auth-store";

export default function MyPageContent() {
  const navigate = useNavigate();
  const me = useAuthStore((s) => s.me);

  const hasMatchingTest = Boolean(me?.matchingTestDone);

  return (
    <MyPageHome
      hasMatchingTest={hasMatchingTest}
      user={{
        name: me?.name ?? "비비",
        roleText: me?.roleText ?? "홍길동",
        email: me?.email ?? "yeahsel0608@cau.ac.kr",
        avatarUrl: me?.avatarUrl ?? "/images/default-avatar.png",
      }}
      onGoMatchingTest={() => navigate({ to: "/matching-test/matching-test/step1" })}
      onOpenProfileCard={() => navigate({ to: "/mypage/profileCard" })}
      onOpenLikes={() => navigate({ to: "/mypage/likes" })}
      onOpenEditProfile={() => navigate({ to: "/mypage/edit" })}
      onOpenNotifications={() => navigate({ to: "/mypage/notifications" })}
      onOpenInquiry={() => navigate({ to: "/mypage/inquiry" })}
      onOpenTerms={() => navigate({ to: "/mypage/terms" })} // policy/terms
      onOpenPrivacy={() => navigate({ to: "/mypage/privacy" })} // policy/privacy
      onLogout={() => {
        useAuthStore.getState().logout?.();
        navigate({ to: "/auth/login" });
      }}
      onWithdraw={() => navigate({ to: "/mypage/withdraw" })}
    />
  );
}
