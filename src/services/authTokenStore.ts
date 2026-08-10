// Kept intentionally separate from Kidora-fe's authTokenStore — the admin
// panel's session is a single 12h JWT with no refresh-cookie flow, so this
// only ever needs to get/set/clear one token + the signed-in username.
const TOKEN_KEY = "kidora_admin_token";
const USERNAME_KEY = "kidora_admin_username";

export function getAdminToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function getAdminUsername(): string | null {
    return localStorage.getItem(USERNAME_KEY);
}

export function setAdminSession(token: string, username: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USERNAME_KEY, username);
}

export function clearAdminSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
}
