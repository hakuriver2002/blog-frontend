const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

interface GoogleOAuthOptions {
    clientId: string;
    redirectUri: string;
    scope?: string[];
}

export function generateState(length: number = 32): string {
    if (typeof window === "undefined") return "";
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

function saveState(state: string) {
    if (typeof document === "undefined") return;
    document.cookie = `oauth_state=${state}; path=/; max-age=600; SameSite=Lax; Secure`;
}

export function buildGoogleOAuthURL(options: GoogleOAuthOptions) {
    const { clientId, redirectUri, scope = ["openid", "email", "profile"] } = options;

    const state = generateState();
    saveState(state);

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: scope.join(" "),
        access_type: "offline",
        prompt: "consent",
        state,
    });

    return `${GOOGLE_OAUTH_URL}?${params.toString()}`;
}

export function redirectToGoogle() {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
        console.error("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID");
        return;
    }

    const url = buildGoogleOAuthURL({
        clientId,
        redirectUri: `${window.location.origin}/auth/callback/google`, // Sync with store and callback page
    });

    window.location.href = url;
}

export function verifyOAuthState(returnedState: string): boolean {
    if (typeof document === "undefined") return false;

    const match = document.cookie.match(/(?:^|; )oauth_state=([^;]*)/);
    const storedState = match ? decodeURIComponent(match[1]) : null;

    document.cookie = 'oauth_state=; Max-Age=0; path=/';

    return !!storedState && storedState === returnedState;
}