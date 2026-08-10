import { call, put, takeLatest } from "redux-saga/effects";
import type { AxiosResponse } from "axios";
import axios from "axios";

import * as types from "../actions/authActionTypes";
import {
    loginSuccess,
    loginFailure,
    bootstrapDone,
    loginRequest
} from "../actions/authActions";
import api from "../services/api";
import {
    getAdminToken,
    getAdminUsername,
    setAdminSession,
    clearAdminSession
} from "../services/authTokenStore";
import type { Admin } from "../types/auth";

type LoginResponse = {
    success: boolean;
    token: string;
    admin: Admin;
    message?: string;
};

function* handleBootstrapSession() {
    const token = getAdminToken();
    const username = getAdminUsername();

    if (token && username) {
        yield put(loginSuccess({ username }));
    } else {
        yield put(bootstrapDone());
    }
}

function* handleLoginRequest(action: ReturnType<typeof loginRequest>) {
    try {

        const { username, password } = action.payload;

        const response: AxiosResponse<LoginResponse> = yield call(
            api.post,
            "/admin/login",
            { username, password }
        );

        setAdminSession(response.data.token, response.data.admin.username);
        yield put(loginSuccess(response.data.admin));

    } catch (error) {

        const message = axios.isAxiosError<LoginResponse>(error) && error.response?.data?.message
            ? error.response.data.message
            : "Invalid username or password.";

        yield put(loginFailure(message));

    }
}

function handleLogout() {
    clearAdminSession();
}

function handleSessionExpired() {
    clearAdminSession();
}

export default function* authSaga() {
    yield takeLatest(types.BOOTSTRAP_SESSION, handleBootstrapSession);
    yield takeLatest(types.LOGIN_REQUEST, handleLoginRequest);
    yield takeLatest(types.LOGOUT, handleLogout);
    yield takeLatest(types.SESSION_EXPIRED, handleSessionExpired);
}
