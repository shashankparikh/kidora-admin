import { useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import {
    fetchSettingsRequest,
    saveSettingsRequest
} from "../../../actions/settingsActions";
import type { PreviewMode } from "../../../types/settings";

const MODES: { value: PreviewMode; label: string; blurb: string }[] = [
    {
        value: "web",
        label: "Show in browser",
        blurb:
            "The visitor waits on the last step and the pages appear as soon as they're painted. Best when generation is fast — they see the magic while they still care."
    },
    {
        value: "email",
        label: "Email a link",
        blurb:
            "The visitor is released immediately and gets an email when the pages are ready. Better when generation is slow, but you lose them from the page — they have to come back."
    }
];

// A story is four pages, so this is the whole available range. Every page is
// a paid image call, which makes this the single biggest lever on what a
// visitor who never buys costs.
const PAGE_COUNTS = [1, 2, 3, 4];

function Settings() {

    const dispatch = useAppDispatch();
    const { values, loading, saving, error, savedAt } = useAppSelector(
        (state) => state.settings
    );

    useEffect(() => {
        dispatch(fetchSettingsRequest());
    }, [dispatch]);

    if (loading && !values) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    const mode = values?.preview_mode ?? "web";
    const pageCount = values?.preview_page_count ?? 4;

    return (
        <Box>

            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
                Changes apply to the next visitor immediately. No deploy needed.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {savedAt && !error && (
                <Alert severity="success" sx={{ mb: 2 }}>Saved.</Alert>
            )}

            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>

                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    How the preview reaches the customer
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                    What happens after someone finishes the wizard.
                </Typography>

                <ToggleButtonGroup
                    exclusive
                    value={mode}
                    disabled={saving}
                    onChange={(_, next: PreviewMode | null) => {
                        // null arrives when the active button is clicked
                        // again. Ignoring it keeps a mode always selected —
                        // there is no valid "neither".
                        if (next) {
                            dispatch(saveSettingsRequest({ preview_mode: next }));
                        }
                    }}
                >
                    {MODES.map((m) => (
                        <ToggleButton key={m.value} value={m.value} sx={{ px: 3 }}>
                            {m.label}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

                <Stack spacing={1} sx={{ mt: 2 }}>
                    {MODES.map((m) => (
                        <Typography
                            key={m.value}
                            variant="body2"
                            color={m.value === mode ? "text.primary" : "text.disabled"}
                        >
                            <strong>{m.label}:</strong> {m.blurb}
                        </Typography>
                    ))}
                </Stack>

                {mode === "email" && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        Email mode needs the customer's address, so they must be
                        signed in before generating. It also depends on the
                        server staying awake long enough to finish — on the free
                        hosting plan a long run can be interrupted, which leaves
                        the book marked as failed rather than silently missing.
                    </Alert>
                )}

            </Paper>

            <Paper variant="outlined" sx={{ p: 3 }}>

                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Pages illustrated in the preview
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                    Every page is a paid image call, so this decides what a
                    visitor who never buys costs you. Remaining pages keep their
                    text and are shown without art.
                </Typography>

                <TextField
                    select
                    size="small"
                    label="Pages"
                    value={pageCount}
                    disabled={saving}
                    sx={{ width: 160 }}
                    onChange={(event) =>
                        dispatch(
                            saveSettingsRequest({
                                preview_page_count: Number(event.target.value)
                            })
                        )
                    }
                >
                    {PAGE_COUNTS.map((n) => (
                        <MenuItem key={n} value={n}>
                            {n} {n === 1 ? "page" : "pages"}
                        </MenuItem>
                    ))}
                </TextField>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" color="text.secondary">
                    A story is always four pages. Illustrating fewer reduces cost
                    per lead proportionally — three instead of four is a 25%
                    saving on everyone who does not convert.
                </Typography>

            </Paper>

        </Box>
    );
}

export default Settings;
