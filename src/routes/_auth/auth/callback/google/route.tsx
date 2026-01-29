import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

interface GoogleCallbackSearch {
    code?: string;
    state?: string;
}

export const Route = createFileRoute("/_auth/auth/callback/google")({
    component: GoogleCallback,
    validateSearch: (search: Record<string, unknown>): GoogleCallbackSearch => ({
        code: typeof search.code === "string" ? search.code : undefined,
        state: typeof search.state === "string" ? search.state : undefined,
    }),
});

function GoogleCallback() {
    const navigate = useNavigate();
    const { code, state } = Route.useSearch();

    useEffect(() => {
        if (code && state) {
            const savedState = sessionStorage.getItem("google_oauth_state");

            if (savedState !== state) {
                navigate({ to: "/login" });
                return;
            }
            sessionStorage.removeItem("google_oauth_state");

            navigate({ to: "/signup/terms", search: { provider: "google" } });
        } else {
            console.error("No code or state found in callback");
            navigate({ to: "/login" });
        }
    }, [code, state, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl">구글 로그인 진행중 ...</div>
        </div>
    );
}
