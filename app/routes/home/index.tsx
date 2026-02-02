import { useEffect, useState } from "react";
import PreHome from "./home-content";
import HomeAfterMatch from "./home-after-match";
import { getMatchingBrands, MatchingTestRequiredError } from "../matching/api/matching";

export default function Home() {
  const [hasMatch, setHasMatch] = useState<boolean | null>(null);

  useEffect(() => {
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
  }, []);

  if (hasMatch === null) {
    return null;
  }

  return hasMatch ? <HomeAfterMatch /> : <PreHome />;
}

