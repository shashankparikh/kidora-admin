import { call, put, takeLatest } from "redux-saga/effects";
import type { AxiosResponse } from "axios";
import axios from "axios";

import * as types from "../actions/settingsActionTypes";
import {
    saveSettingsRequest,
    fetchSettingsSuccess,
    fetchSettingsFailure,
    saveSettingsSuccess,
    saveSettingsFailure
} from "../actions/settingsActions";
import api from "../services/api";
import type { AppSettings } from "../types/settings";

type SettingsResponse = { success: boolean; settings: AppSettings; message?: string };

function* handleFetchSettings() {
    try {

        const response: AxiosResponse<SettingsResponse> = yield call(
            api.get,
            "/admin/settings"
        );

        yield put(fetchSettingsSuccess(response.data.settings));

    } catch (error) {

        const message =
            axios.isAxiosError<SettingsResponse>(error) && error.response?.data?.message
                ? error.response.data.message
                : "Couldn't load settings.";

        yield put(fetchSettingsFailure(message));

    }
}

function* handleSaveSettings(action: ReturnType<typeof saveSettingsRequest>) {
    try {

        const response: AxiosResponse<SettingsResponse> = yield call(
            api.patch,
            "/admin/settings",
            action.payload.updates
        );

        yield put(saveSettingsSuccess(response.data.settings));

    } catch (error) {

        // The backend returns 400 with a specific message for a rejected
        // value ("preview_page_count cannot exceed 4"). Surfacing that beats
        // a generic failure, because it tells the operator what to change.
        const message =
            axios.isAxiosError<SettingsResponse>(error) && error.response?.data?.message
                ? error.response.data.message
                : "Couldn't save settings.";

        yield put(saveSettingsFailure(message));

    }
}

export default function* settingsSaga() {
    yield takeLatest(types.FETCH_SETTINGS_REQUEST, handleFetchSettings);
    yield takeLatest(types.SAVE_SETTINGS_REQUEST, handleSaveSettings);
}
