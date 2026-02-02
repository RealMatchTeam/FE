import { useNavigate } from "react-router";
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
        email: me?.email ?? "example@gmail.com",
        avatarUrl: me?.avatarUrl ?? "/images/default-avatar.png",
      }}
      onGoMatchingTest={() => navigate("/matching/test/step1")}
      onOpenProfileCard={() => navigate( "/mypage/profileCard")}
      onOpenLikes={() => navigate( "/mypage/likes")}
      onOpenEditProfile={() => navigate("/mypage/edit")}
      onOpenNotifications={() => navigate("/mypage/notifications")}
      onOpenInquiry={() => navigate("/mypage/inquiry")}
      onOpenTerms={() => navigate("/mypage/terms")} // policy/terms
      onOpenPrivacy={() => navigate("/mypage/privacy")} // policy/privacy
      onLogout={() => {
        useAuthStore.getState().logout?.();
        navigate("/auth/login");
      }}
      onWithdraw={() => navigate("/mypage/withdraw")}
    />
  );
}
