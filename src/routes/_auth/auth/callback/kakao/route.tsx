import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

interface KakaoCallbackSearch {
    code?: string;
}

export const Route = createFileRoute("/_auth/auth/callback/kakao")({
    component: KakaoCallback,
    validateSearch: (search: Record<string, unknown>): KakaoCallbackSearch => ({
        code: typeof search.code === "string" ? search.code : undefined,
    }),
});

function KakaoCallback() {
    const navigate = useNavigate();
    const { code } = Route.useSearch();

    useEffect(() => {
        if (code) {
            navigate({ to: "/signup/terms", search: { provider: "kakao" } });
        } else {
            console.error("No code found in callback");
            navigate({ to: "/login" });
        }
    }, [code, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl">카카오 로그인 진행중...</div>
        </div>
    );
}
