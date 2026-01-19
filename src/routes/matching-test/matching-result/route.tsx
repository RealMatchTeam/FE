import { createFileRoute } from "@tanstack/react-router";
import MatchingResultContent from "./matching-result-content";

type Step4Search = {
    userName?: string;
    fitTraits?: string;
    styleTraits?: string;
    moodTraits?: string;
    recommendedBrand?: string;
};

export const Route = createFileRoute("/matching-test/matching-result")({
    component: MatchingResultContent,
    validateSearch: (search: Record<string, unknown>): Step4Search => ({
        userName: typeof search.userName === "string" ? search.userName : undefined,
        fitTraits: typeof search.fitTraits === "string" ? search.fitTraits : undefined,
        styleTraits:
            typeof search.styleTraits === "string" ? search.styleTraits : undefined,
        moodTraits:
            typeof search.moodTraits === "string" ? search.moodTraits : undefined,
        recommendedBrand:
            typeof search.recommendedBrand === "string"
                ? search.recommendedBrand
                : undefined,
    }),
});
