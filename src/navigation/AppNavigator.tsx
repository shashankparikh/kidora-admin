import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../screens/Login/Login";
import DashboardLayout from "../screens/Dashboard/DashboardLayout";
import Orders from "../screens/Dashboard/Orders/Orders";
import Reviews from "../screens/Dashboard/Reviews/Reviews";
import Payments from "../screens/Dashboard/Payments/Payments";
import Settings from "../screens/Dashboard/Settings/Settings";

function AppNavigator() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="orders" replace />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="reviews" element={<Reviews />} />
                    <Route path="payments" element={<Payments />} />
                    <Route path="settings" element={<Settings />} />
                </Route>

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppNavigator;
