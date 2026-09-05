export type PreviewMode = "web" | "email";

// Mirrors db/settingsStore.js SCHEMA on the backend. Snake_case because the
// admin API deliberately returns the raw storage keys — the operator is
// editing the settings themselves, not a presentation of them.
export type AppSettings = {
    preview_mode: PreviewMode;
    preview_page_count: number;
};
