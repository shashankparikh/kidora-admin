import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { loginRequest } from "../../actions/authActions";

function Login() {

    const dispatch = useAppDispatch();
    const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        dispatch(loginRequest(username.trim(), password));
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.default",
                px: 2
            }}
        >
            <Paper elevation={2} sx={{ p: 4, width: "100%", maxWidth: 360 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    Kidora Admin
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Sign in to manage orders and reviews.
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                    <TextField
                        label="Username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        autoFocus
                        fullWidth
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        fullWidth
                        required
                    />

                    {error && <Alert severity="error">{error}</Alert>}

                    <Button type="submit" variant="contained" size="large" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );

}

export default Login;
