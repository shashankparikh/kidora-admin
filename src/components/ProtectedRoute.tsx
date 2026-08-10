import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "../hooks/useAppSelector";

function ProtectedRoute({ children }: { children: ReactNode }) {

    const { isAuthenticated, bootstrapped } = useAppSelector((state) => state.auth);

    // Wait for the one-time localStorage check on app boot before deciding
    // to bounce to /login — otherwise a hard refresh on /dashboard would
    // flash straight to the login screen even with a valid stored token.
    if (!bootstrapped) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;

}

export default ProtectedRoute;
