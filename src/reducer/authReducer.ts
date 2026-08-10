import * as types from "../actions/authActionTypes";
import type { AuthAction } from "../actions/authActions";
import type { Admin } from "../types/auth";

export type AuthState = {
    admin: Admin | null;
    isAuthenticated: boolean;
    bootstrapped: boolean;
    loading: boolean;
    error: string | null;
};

const initialState: AuthState = {
    admin: null,
    isAuthenticated: false,
    bootstrapped: false,
    loading: false,
    error: null
};

export default function authReducer(state = initialState, action: AuthAction): AuthState {
    switch (action.type) {

        case types.BOOTSTRAP_SESSION:
            return { ...state, loading: true };

        case types.BOOTSTRAP_DONE:
            return { ...state, loading: false, bootstrapped: true };

        case types.LOGIN_REQUEST:
            return { ...state, loading: true, error: null };

        case types.LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                bootstrapped: true,
                isAuthenticated: true,
                admin: action.payload.admin,
                error: null
            };

        case types.LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
                bootstrapped: true,
                isAuthenticated: false,
                admin: null,
                error: action.payload.message
            };

        case types.LOGOUT:
        case types.SESSION_EXPIRED:
            return {
                ...state,
                loading: false,
                bootstrapped: true,
                isAuthenticated: false,
                admin: null
            };

        default:
            return state;
    }
}
