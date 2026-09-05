import * as types from "./settingsActionTypes";
import type { AppSettings } from "../types/settings";

export const fetchSettingsRequest = () => ({
    type: types.FETCH_SETTINGS_REQUEST
} as const);

export const fetchSettingsSuccess = (settings: AppSettings) => ({
    type: types.FETCH_SETTINGS_SUCCESS,
    payload: { settings }
} as const);

export const fetchSettingsFailure = (message: string) => ({
    type: types.FETCH_SETTINGS_FAILURE,
    payload: { message }
} as const);

export const saveSettingsRequest = (updates: Partial<AppSettings>) => ({
    type: types.SAVE_SETTINGS_REQUEST,
    payload: { updates }
} as const);

export const saveSettingsSuccess = (settings: AppSettings) => ({
    type: types.SAVE_SETTINGS_SUCCESS,
    payload: { settings }
} as const);

export const saveSettingsFailure = (message: string) => ({
    type: types.SAVE_SETTINGS_FAILURE,
    payload: { message }
} as const);

export type SettingsAction =
    | ReturnType<typeof fetchSettingsRequest>
    | ReturnType<typeof fetchSettingsSuccess>
    | ReturnType<typeof fetchSettingsFailure>
    | ReturnType<typeof saveSettingsRequest>
    | ReturnType<typeof saveSettingsSuccess>
    | ReturnType<typeof saveSettingsFailure>;
