import { createFileRoute } from "@tanstack/react-router";
import SignUpPurposeContent from "./signup-purpose-content";

type SignUpPurposeSearch = {
  provider: "kakao" | "naver" | "google";
};

export const Route = createFileRoute("/auth/signup/purpose")({
  component: SignUpPurposeContent,
  validateSearch: (search: Record<string, unknown>): SignUpPurposeSearch => {
    return {
      provider: (search.provider as "kakao" | "naver" | "google") || "kakao",
    };
  },
});
