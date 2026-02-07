import { useEffect } from "react";
import { useNavigate } from "react-router";
import MyPageHome from "../components/MyPageHome";
import { useAuthStore } from "../../../stores/auth-store";
import { getMyPage } from "../api/mypage";

export default function MyPageContent() {
  const navigate = useNavigate();
  const me = useAuthStore((s) => s.me);
  const setMe = useAuthStore((s) => s.setMe);

  useEffect(() => {
    let isMounted = true;

    const fetchMyPage = async () => {
      try {
        const result = await getMyPage();

        if (!isMounted) return;

        const name = result.name ?? result.nickname ?? "";
        const roleText = result.nickname ?? result.name ?? "";

        setMe({
          name,
          roleText,
          email: result.email,
          avatarUrl: result.profileImageUrl ?? undefined,
          matchingTestDone: Boolean(result.hasMatchingTest),
        });
      } catch (error) {
        console.error("마이페이지 정보 조회 실패:", error);
      }
    };

    fetchMyPage();

    return () => {
      isMounted = false;
    };
  }, [setMe]);

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
