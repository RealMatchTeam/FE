import { Navigate } from "react-router";
import { useEffect, useState } from "react";
import { getMyPage } from "../mypage/api/mypage";
import { getMatchingBrands, MatchingTestRequiredError } from "../matching/api/matching";
import { useAuthStore } from "../../stores/auth-store";
import { tokenStorage } from "../../lib/token";

export default function HomeIndex() {
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

  // 1) 토큰 있는데 me가 없으면 내 정보 로드해서 matchingTestDone 결정
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
      } catch (e) {
        if (isMounted) setMe({ matchingTestDone: false });
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [hasTokens, me?.matchingTestDone, setMe]);

  // 2) 매칭테스트 완료면 매칭 결과 존재 여부 확인
  useEffect(() => {
    if (resolvedHasMatchingTest !== true) return;

    (async () => {
      try {
        const { count } = await getMatchingBrands();
        setHasMatch(count > 0);
      } catch (error) {
        if (error instanceof MatchingTestRequiredError) setHasMatch(false);
        else setHasMatch(false);
      }
    })();
  }, [resolvedHasMatchingTest]);

  // 3) 분기
  if (resolvedHasMatchingTest === false) {
    return <Navigate to="/pre" replace />;
  }

  // 로딩(토큰 있는 유저의 me/매칭 상태 확인 중)
  if (resolvedHasMatchingTest === null || (resolvedHasMatchingTest === true && hasMatch === null)) {
    return (
      <div className="flex items-center justify-center w-full min-h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">로딩중...</span>
        </div>
      </div>
    );
  }

  // 매칭테스트 완료 + 결과 있으면 /home, 없으면 /pre
  return <Navigate to={hasMatch ? "/home" : "/pre"} replace />;
}
