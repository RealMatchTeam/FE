import { createFileRoute } from "@tanstack/react-router";
import SignUpSuccessContent from "./signup-success-content";

type SignUpSuccessSearch = {
  provider: "kakao" | "naver" | "google";
};

export const Route = createFileRoute("/_auth/signup/success")({
  component: SignUpSuccessContent,
  validateSearch: (search: Record<string, unknown>): SignUpSuccessSearch => {
    return {
      provider: (search.provider as "kakao" | "naver" | "google") || "kakao",
    };
  },
});
