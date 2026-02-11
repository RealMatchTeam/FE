import { useEffect, useState, useRef } from "react";
import { getMyPage } from "../mypage/api/mypage";
import { getMatchingBrands, MatchingTestRequiredError } from "../matching/api/matching";
import { useAuthStore } from "../../stores/auth-store";
import { tokenStorage } from "../../lib/token";
import HomeContent from "./home-content";
import HomeAfterMatch from "./home-after-match";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function HomeIndex() {
  const [hasMatch, setHasMatch] = useState<boolean | null>(null);
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
  }, [hasTokens, setMe]);

  useEffect(() => {
    if (resolvedHasMatchingTest !== true) return;

    let isMounted = true;

    (async () => {
      try {
        const { count } = await getMatchingBrands();
        if (!isMounted) return;
        setHasMatch(count > 0);
      } catch (error: unknown) {
        if (!isMounted) return;
        if (error instanceof MatchingTestRequiredError) setHasMatch(false);
        else setHasMatch(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [resolvedHasMatchingTest]);

  const effectiveHasMatch = resolvedHasMatchingTest !== true ? null : hasMatch;

  if (resolvedHasMatchingTest === false) {
    return <HomeContent />;
  }

  if (resolvedHasMatchingTest === null || effectiveHasMatch === null) {
    return (
      <LoadingSpinner className="min-h-[50vh]" />
    );
  }

  return <HomeAfterMatch />;
}
