import { createFileRoute } from "@tanstack/react-router";
import SignUpInfoContent from "./signup-info-content";

type SignUpInfoSearch = {
  provider: "kakao" | "naver" | "google";
};

export const Route = createFileRoute("/auth/signup/info")({
  component: SignUpInfoContent,
  validateSearch: (search: Record<string, unknown>): SignUpInfoSearch => {
    return {
      provider: (search.provider as "kakao" | "naver" | "google") || "kakao",
    };
  },
});
