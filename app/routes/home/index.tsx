import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import { getMyPage } from "../mypage/api/mypage";
import { getMatchingBrands, MatchingTestRequiredError } from "../matching/api/matching";
import { useAuthStore } from "../../stores/auth-store";
import { tokenStorage } from "../../lib/token";
import HomeContent from "./home-content";
import HomeAfterMatch from "./home-after-match";

export default function HomeIndex() {
  const location = useLocation();
  const [hasMatch, setHasMatch] = useState<boolean | null>(null);

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
    if (me?.matchingTestDone !== undefined) return;
    if (!hasTokens) return;

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
  }, [hasTokens, me?.matchingTestDone, setMe]);

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
      <div className="flex items-center justify-center w-full min-h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">로딩중...</span>
        </div>
      </div>
    );
  }

  return <HomeAfterMatch />;
}
