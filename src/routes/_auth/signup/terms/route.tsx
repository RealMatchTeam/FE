import { createFileRoute } from "@tanstack/react-router";
import SignUpTermsContent from "./signup-terms-content";

type SignUpTermsSearch = {
  provider: "kakao" | "naver" | "google";
};

export const Route = createFileRoute("/_auth/signup/terms")({
  component: SignUpTermsContent,
  validateSearch: (search: Record<string, unknown>): SignUpTermsSearch => {
    return {
      provider: (search.provider as "kakao" | "naver" | "google") || "kakao", // 기본값은 안전장치로
    };
  },
});
