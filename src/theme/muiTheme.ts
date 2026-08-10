import { createTheme } from "@mui/material/styles";

// Deliberately plain — this is an internal admin tool, not the branded
// customer-facing site, so it skips Kidora-fe's custom navy/gold theme in
// favor of MUI's default look with a couple of small tweaks. Matches the
// "simple and generic, like any other normal dashboard" brief.
const muiTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#3f51b5"
        },
        background: {
            default: "#f4f5f7"
        }
    },
    shape: {
        borderRadius: 8
    }
});

export default muiTheme;
