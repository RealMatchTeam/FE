import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

interface NaverCallbackSearch {
    code?: string;
    state?: string;
}

export const Route = createFileRoute("/_auth/auth/callback/naver")({
    component: NaverCallback,
    validateSearch: (search: Record<string, unknown>): NaverCallbackSearch => ({
        code: typeof search.code === "string" ? search.code : undefined,
        state: typeof search.state === "string" ? search.state : undefined,
    }),
});

function NaverCallback() {
    const navigate = useNavigate();
    const { code, state } = Route.useSearch();

    useEffect(() => {
        if (code && state) {
            const savedState = sessionStorage.getItem("naver_oauth_state");

            if (savedState !== state) {
                navigate({ to: "/login" });
                return;
            }
            sessionStorage.removeItem("naver_oauth_state");

            navigate({ to: "/signup/terms", search: { provider: "naver" } });
        } else {
            console.error("No code or state found in callback");
            navigate({ to: "/login" });
        }
    }, [code, state, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl">네이버 로그인 진행중 ...</div>
        </div>
    );
}
