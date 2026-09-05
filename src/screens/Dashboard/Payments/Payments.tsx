import { useEffect, useMemo, useState } from "react";
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
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";

import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { fetchPaymentsRequest, refundPaymentRequest } from "../../../actions/paymentsActions";
import type { PaymentDisplayStatus } from "../../../types/payment";

type FilterValue = PaymentDisplayStatus | "all";

const FILTERS: { label: string; value: FilterValue }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Paid", value: "paid" },
    { label: "Needs Attention", value: "needs_attention" },
    { label: "Refund Initiated", value: "refund_initiated" },
    { label: "Refund Completed", value: "refund_completed" },
    { label: "Failed", value: "failed" }
];

const STATUS_LABEL: Record<PaymentDisplayStatus, string> = {
    pending: "Pending",
    paid: "Paid",
    needs_attention: "Needs Attention",
    refund_initiated: "Refund Initiated",
    refund_completed: "Refund Completed",
    failed: "Failed"
};

const STATUS_COLOR: Record<PaymentDisplayStatus, "default" | "warning" | "success" | "error" | "info"> = {
    pending: "default",
    paid: "success",
    needs_attention: "warning",
    refund_initiated: "info",
    refund_completed: "success",
    failed: "error"
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleString();
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);
}

function Payments() {

    const dispatch = useAppDispatch();
    const { items, loading, error, refundingIds, refundError } = useAppSelector((state) => state.payments);

    // Filtered client-side rather than via a server round-trip like
    // Orders' tabs — 'captured' alone can't say whether a payment is
    // "paid" or "needs_attention" (that also depends on order_id), so
    // kidora-be computes displayStatus once per payment and every tab
    // here just filters the one response by it.
    const [filter, setFilter] = useState<FilterValue>("all");

    useEffect(() => {
        dispatch(fetchPaymentsRequest());
    }, [dispatch]);

    const filteredItems = useMemo(
        () => (filter === "all" ? items : items.filter((payment) => payment.displayStatus === filter)),
        [items, filter]
    );

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Payments
            </Typography>

            <Tabs
                value={filter}
                onChange={(_event, value: FilterValue) => setFilter(value)}
                sx={{ mb: 2 }}
                variant="scrollable"
                scrollButtons="auto"
            >
                {FILTERS.map((item) => (
                    <Tab key={item.value} label={item.label} value={item.value} />
                ))}
            </Tabs>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {refundError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {refundError}
                </Alert>
            )}

            <Paper variant="outlined">
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : filteredItems.length === 0 ? (
                    <Box sx={{ py: 6, textAlign: "center" }}>
                        <Typography color="text.secondary">No payments found.</Typography>
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Payment</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Order</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredItems.map((payment) => {

                                const isRefunding = refundingIds.includes(payment.id);

                                return (
                                    <TableRow key={payment.id} hover>
                                        <TableCell sx={{ fontFamily: "monospace", fontSize: 13 }}>
                                            {payment.razorpayOrderId}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{payment.customerName ?? "—"}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {payment.customerEmail ?? ""}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                                        <TableCell sx={{ fontFamily: "monospace", fontSize: 13 }}>
                                            {payment.orderId ?? "—"}
                                        </TableCell>
                                        <TableCell>{formatDate(payment.createdAt)}</TableCell>
                                        <TableCell>
                                            <Tooltip
                                                title={payment.failureReason ?? ""}
                                                disableHoverListener={!payment.failureReason}
                                            >
                                                <Chip
                                                    size="small"
                                                    label={STATUS_LABEL[payment.displayStatus]}
                                                    color={STATUS_COLOR[payment.displayStatus]}
                                                />
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="right">
                                            {payment.displayStatus === "needs_attention" && (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="warning"
                                                    disabled={isRefunding}
                                                    onClick={() => dispatch(refundPaymentRequest(payment.id))}
                                                >
                                                    {isRefunding ? "Refunding…" : "Refund"}
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );

                            })}
                        </TableBody>
                    </Table>
                )}
            </Paper>
        </Box>
    );

}

export default Payments;
