import { Outlet, useNavigate, NavLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Drawer from "@mui/material/Drawer";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RateReviewIcon from "@mui/icons-material/RateReview";
import PaymentsIcon from "@mui/icons-material/Payments";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { logout } from "../../actions/authActions";

const SIDEBAR_WIDTH = 220;

const NAV_ITEMS = [
    { label: "Orders", to: "/dashboard/orders", icon: <ReceiptLongIcon /> },
    { label: "Payments", to: "/dashboard/payments", icon: <PaymentsIcon /> },
    { label: "Reviews", to: "/dashboard/reviews", icon: <RateReviewIcon /> },
    { label: "Settings", to: "/dashboard/settings", icon: <SettingsIcon /> }
];

function DashboardLayout() {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const admin = useAppSelector((state) => state.auth.admin);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login", { replace: true });
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <AppBar
                position="fixed"
                color="inherit"
                elevation={0}
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    borderBottom: "1px solid",
                    borderColor: "divider"
                }}
            >
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Kidora Admin
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        {admin && (
                            <Typography variant="body2" color="text.secondary">
                                {admin.username}
                            </Typography>
                        )}
                        <Tooltip title="Log out">
                            <IconButton onClick={handleLogout} color="inherit">
                                <LogoutIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: SIDEBAR_WIDTH,
                    flexShrink: 0,
                    ["& .MuiDrawer-paper"]: { width: SIDEBAR_WIDTH, boxSizing: "border-box" }
                }}
            >
                <Toolbar />
                <List sx={{ pt: 2 }}>
                    {NAV_ITEMS.map((item) => (
                        <ListItemButton
                            key={item.to}
                            component={NavLink}
                            to={item.to}
                            sx={{
                                "&.active": {
                                    bgcolor: "action.selected",
                                    borderRight: "3px solid",
                                    borderColor: "primary.main"
                                }
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );

}

export default DashboardLayout;
