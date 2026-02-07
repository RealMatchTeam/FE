import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import MyPageHome from "../components/MyPageHome";
import { useAuthStore } from "../../../stores/auth-store";
import { getMyPage } from "../api/mypage";
import mypageDefault from "../../../assets/mypage-default.svg";

export default function MyPageContent() {
  const navigate = useNavigate();
  const me = useAuthStore((s) => s.me);
  const setMe = useAuthStore((s) => s.setMe);
  const [loaded, setLoaded] = useState(false);

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
        setLoaded(true);
      } catch (error) {
        console.error("마이페이지 정보 조회 실패:", error);
        setLoaded(true);
      }
    };

    fetchMyPage();

    return () => {
      isMounted = false;
    };
  }, [setMe]);

  const hasMatchingTest = loaded ? Boolean(me?.matchingTestDone) : null;

  return (
    <MyPageHome
      hasMatchingTest={hasMatchingTest}
      user={{
        name: me?.name ?? "비비",
        roleText: me?.roleText ?? "홍길동",
        email: me?.email ?? "example@gmail.com",
        avatarUrl: me?.avatarUrl ?? mypageDefault,
      }}
      onGoMatchingTest={() => navigate("/matching/test/step1")}
      onOpenProfileCard={() => navigate( "/mypage/profileCard")}
      onOpenLikes={() => navigate( "/mypage/likes")}
      onOpenEditProfile={() => navigate("/mypage/edit")}
      onOpenNotifications={() => navigate("/mypage/notification")}
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
