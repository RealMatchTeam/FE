export const KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize";
export const NAVER_AUTH_URL = "https://nid.naver.com/oauth2.0/authorize";
export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export const getKakaoAuthUrl = () => {
    const apiKey = import.meta.env.VITE_KAKAO_JS_KEY;
    const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;

    if (!apiKey || !redirectUri) {
        console.error("Kakao API Key or Redirect URI is missing in .env");
        return "#";
    }

    const params = new URLSearchParams({
        client_id: apiKey,
        redirect_uri: redirectUri,
        response_type: "code",
    });

    return `${KAKAO_AUTH_URL}?${params.toString()}`;
};

export const getNaverAuthUrl = () => {
    const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_NAVER_REDIRECT_URI;

    if (!clientId || !redirectUri) {
        console.error("Naver Client ID or Redirect URI is missing in .env");
        return "#";
    }

    const state = Math.random().toString(36).substring(2, 15);
    if (typeof window !== "undefined") {
        sessionStorage.setItem("naver_oauth_state", state);
    }

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        state,
    });

    return `${NAVER_AUTH_URL}?${params.toString()}`;
};

export const getGoogleAuthUrl = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

    if (!clientId || !redirectUri) {
        console.error("Google Client ID or Redirect URI is missing in .env");
        return "#";
    }

    const state = Math.random().toString(36).substring(2, 15);
    if (typeof window !== "undefined") {
        sessionStorage.setItem("google_oauth_state", state);
    }

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        state,
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent",
    });

    return `${GOOGLE_AUTH_URL}?${params.toString()}`;
};
