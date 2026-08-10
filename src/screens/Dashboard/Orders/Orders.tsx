import { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { fetchOrdersRequest, setOrdersStatusFilter } from "../../../actions/ordersActions";
import type { OrderStatusFilter } from "../../../types/order";

const FILTERS: { label: string; value: OrderStatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Success", value: "success" },
    { label: "Rejected", value: "rejected" }
];

const STATUS_COLOR: Record<string, "default" | "warning" | "success" | "error"> = {
    pending: "warning",
    success: "success",
    rejected: "error"
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleString();
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);
}

function Orders() {

    const dispatch = useAppDispatch();
    const { items, statusFilter, loading, error } = useAppSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchOrdersRequest(statusFilter));
    }, [dispatch, statusFilter]);

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Orders
            </Typography>

            <Tabs
                value={statusFilter}
                onChange={(_event, value: OrderStatusFilter) => dispatch(setOrdersStatusFilter(value))}
                sx={{ mb: 2 }}
            >
                {FILTERS.map((filter) => (
                    <Tab key={filter.value} label={filter.label} value={filter.value} />
                ))}
            </Tabs>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper variant="outlined">
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : items.length === 0 ? (
                    <Box sx={{ py: 6, textAlign: "center" }}>
                        <Typography color="text.secondary">No orders found.</Typography>
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Story</TableCell>
                                <TableCell>Placed</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((order) => (
                                <TableRow key={order.id} hover>
                                    <TableCell sx={{ fontFamily: "monospace", fontSize: 13 }}>
                                        {order.id}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{order.customerName ?? "—"}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {order.customerEmail ?? ""}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {order.bookTitle ?? "—"}
                                        {order.storyTheme && (
                                            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                                                {order.storyTheme}
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>{formatDate(order.placedAt)}</TableCell>
                                    <TableCell>{formatCurrency(order.total)}</TableCell>
                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={order.status}
                                            color={STATUS_COLOR[order.status] ?? "default"}
                                            sx={{ textTransform: "capitalize" }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Paper>
        </Box>
    );

}

export default Orders;
