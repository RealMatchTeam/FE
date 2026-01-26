import { createFileRoute } from "@tanstack/react-router";
import SignUpTypeContent from "./signup-type-content";

type SignUpTypeSearch = {
  provider?: "kakao" | "naver" | "google";
};

export const Route = createFileRoute("/auth/signup/type")({
  component: SignUpTypeContent,
  validateSearch: (search: Record<string, unknown>): SignUpTypeSearch => {
    return {
      provider: (search.provider === "kakao" || search.provider === "naver" || search.provider === "google")
        ? (search.provider as "kakao" | "naver" | "google")
        : undefined,
    };
  },
});
