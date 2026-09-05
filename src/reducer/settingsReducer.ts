import * as types from "../actions/settingsActionTypes";
import type { SettingsAction } from "../actions/settingsActions";
import type { AppSettings } from "../types/settings";

export type SettingsState = {
    values: AppSettings | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
    // Cleared on the next change so a stale "Saved" cannot sit above a
    // control the operator has since edited.
    savedAt: number | null;
};

const initialState: SettingsState = {
    values: null,
    loading: false,
    saving: false,
    error: null,
    savedAt: null
};

export default function settingsReducer(
    state = initialState,
    action: SettingsAction
): SettingsState {
    switch (action.type) {

        case types.FETCH_SETTINGS_REQUEST:
            return { ...state, loading: true, error: null };

        case types.FETCH_SETTINGS_SUCCESS:
            return { ...state, loading: false, values: action.payload.settings };

        case types.FETCH_SETTINGS_FAILURE:
            return { ...state, loading: false, error: action.payload.message };

        case types.SAVE_SETTINGS_REQUEST:
            return { ...state, saving: true, error: null, savedAt: null };

        // The server returns the full settings object it actually stored, so
        // this replaces local state rather than merging the optimistic value.
        // If validation coerced or rejected something, the operator sees what
        // is really in effect instead of what they typed.
        case types.SAVE_SETTINGS_SUCCESS:
            return {
                ...state,
                saving: false,
                values: action.payload.settings,
                savedAt: Date.now()
            };

        case types.SAVE_SETTINGS_FAILURE:
            return { ...state, saving: false, error: action.payload.message };

        default:
            return state;
    }
}
