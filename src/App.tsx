import { useEffect } from "react";

import { useAppDispatch } from "./hooks/useAppDispatch";
import { bootstrapSession, sessionExpired } from "./actions/authActions";
import { SESSION_EXPIRED_EVENT } from "./services/api";
import AppNavigator from "./navigation/AppNavigator";

function App() {

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(bootstrapSession());
    }, [dispatch]);

    // A 401 anywhere (see services/api.ts) clears the stored token and
    // fires this DOM event so the app drops back to "logged out" state
    // without every saga needing to know about HTTP internals.
    useEffect(() => {
        const handleSessionExpired = () => dispatch(sessionExpired());
        window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
        return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    }, [dispatch]);

    return <AppNavigator />;

}

export default App;
