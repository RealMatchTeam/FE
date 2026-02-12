import { useEffect, useRef } from "react";
import { getMyPage } from "../mypage/api/mypage";
import { useAuthStore } from "../../stores/auth-store";
import { tokenStorage } from "../../lib/token";
import HomeContent from "./home-content";
import HomeAfterMatch from "./home-after-match";

export default function HomeIndex() {
  const hasLoadedRef = useRef(false);

  const me = useAuthStore((s) => s.me);
  const setMe = useAuthStore((s) => s.setMe);

  const hasTokens = tokenStorage.hasTokens();

  const resolvedHasMatchingTest =
    me?.matchingTestDone !== undefined
      ? Boolean(me.matchingTestDone)
      : hasTokens
        ? null
        : false;

  useEffect(() => {
    // 이미 로드했거나 매칭 테스트 정보가 있으면 skip
    if (hasLoadedRef.current || me?.matchingTestDone !== undefined) return;
    if (!hasTokens) return;

    hasLoadedRef.current = true;
    let isMounted = true;

    (async () => {
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
      } catch (error: unknown) {
        console.error(error);
        if (isMounted) setMe({ matchingTestDone: false });
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [hasTokens, setMe, me?.matchingTestDone]);

  // 토큰 없으면 비로그인 홈
  if (!hasTokens) {
    return <HomeContent />;
  }

  // 매칭 테스트 안 했다고 확정된 경우
  if (resolvedHasMatchingTest === false) {
    return <HomeContent />;
  }

  // 토큰 있으면 낙관적으로 바로 HomeAfterMatch 렌더 (getMyPage와 병렬 로딩)
  return <HomeAfterMatch />;
}
