import { useEffect, useState } from "react";
import PreHome from "./home-content";
import HomeAfterMatch from "./home-after-match";
import {
  getMatchingBrands,
  MatchingTestRequiredError,
} from "../matching/api/matching";
import { useAuthStore } from "../../stores/auth-store";

export default function Home() {
  const [hasMatch, setHasMatch] = useState<boolean | null>(null);
  const hasMatchingTest = useAuthStore((s) => s.me?.matchingTestDone);

  useEffect(() => {
    if (hasMatchingTest === false) {
      setHasMatch(false);
      return;
    }

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
  }, [hasMatchingTest]);

  if (hasMatchingTest === false) {
    return <PreHome />;
  }

  if (hasMatch === null) {
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
