import axios from "axios";

import { getAdminToken, clearAdminSession } from "./authTokenStore";

export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000
});

api.interceptors.request.use((config) => {
    const token = getAdminToken();
    if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
});

// The admin token is a plain 12h JWT with no refresh flow (see
// kidora-be/utils/tokens.js signAdminToken). On expiry — or any other
// 401 — the cleanest recovery is sending the operator back to the login
// screen rather than trying to silently refresh a session that doesn't
// exist. This fires a DOM event rather than importing the store directly
// to avoid a store <-> saga <-> api circular import.
export const SESSION_EXPIRED_EVENT = "kidora-admin-session-expired";

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearAdminSession();
            window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
        }
        return Promise.reject(error);
    }
);

export default api;
