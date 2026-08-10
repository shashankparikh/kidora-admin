import * as types from "./authActionTypes";
import type { Admin } from "../types/auth";

export const bootstrapSession = () => ({ type: types.BOOTSTRAP_SESSION } as const);

export const bootstrapDone = () => ({ type: types.BOOTSTRAP_DONE } as const);

export const loginRequest = (username: string, password: string) => ({
    type: types.LOGIN_REQUEST,
    payload: { username, password }
} as const);

export const loginSuccess = (admin: Admin) => ({
    type: types.LOGIN_SUCCESS,
    payload: { admin }
} as const);

export const loginFailure = (message: string) => ({
    type: types.LOGIN_FAILURE,
    payload: { message }
} as const);

export const logout = () => ({ type: types.LOGOUT } as const);

export const sessionExpired = () => ({ type: types.SESSION_EXPIRED } as const);

export type AuthAction =
    | ReturnType<typeof bootstrapSession>
    | ReturnType<typeof bootstrapDone>
    | ReturnType<typeof loginRequest>
    | ReturnType<typeof loginSuccess>
    | ReturnType<typeof loginFailure>
    | ReturnType<typeof logout>
    | ReturnType<typeof sessionExpired>;
