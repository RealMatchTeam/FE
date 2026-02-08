import { useEffect, useState } from "react";
import PreHome from "./home-content";
import HomeAfterMatch from "./home-after-match";
import {
  getMatchingBrands,
  MatchingTestRequiredError,
} from "../matching/api/matching";
import { useAuthStore } from "../../stores/auth-store";
import { getMyPage } from "../mypage/api/mypage";
import { tokenStorage } from "../../lib/token";

export default function Home() {
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

    const fetchMe = async () => {
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
        console.error("Failed to load my page info:", error);
        if (isMounted) {
          setMe({ matchingTestDone: false });
        }
      }
    };

    fetchMe();

    return () => {
      isMounted = false;
    };
  }, [hasTokens, me?.matchingTestDone, setMe]);

  useEffect(() => {
    if (resolvedHasMatchingTest !== true) return;

    const checkMatchStatus = async () => {
      try {
        const { count } = await getMatchingBrands();
        setHasMatch(count > 0);
      } catch (error) {
        if (error instanceof MatchingTestRequiredError) {
          setHasMatch(false);
        } else {
          console.error("Failed to check match status:", error);
          setHasMatch(false);
        }
      }
    };

    checkMatchStatus();
  }, [resolvedHasMatchingTest]);

  if (resolvedHasMatchingTest === false) {
    return <PreHome />;
  }

  if (resolvedHasMatchingTest === null || hasMatch === null) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">로딩중...</span>
        </div>
      </div>
    );
  }

  return <HomeAfterMatch />;
}
