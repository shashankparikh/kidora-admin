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
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Rating from "@mui/material/Rating";

import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import {
    fetchReviewsRequest,
    setReviewsStatusFilter,
    moderateReviewRequest
} from "../../../actions/reviewsActions";
import type { ReviewStatusFilter } from "../../../types/review";

const FILTERS: { label: string; value: ReviewStatusFilter }[] = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
    { label: "All", value: "all" }
];

const STATUS_COLOR: Record<string, "default" | "warning" | "success" | "error"> = {
    pending: "warning",
    approved: "success",
    rejected: "error"
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleString();
}

function Reviews() {

    const dispatch = useAppDispatch();
    const { items, statusFilter, loading, error, moderating } = useAppSelector((state) => state.reviews);

    useEffect(() => {
        dispatch(fetchReviewsRequest(statusFilter));
    }, [dispatch, statusFilter]);

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                Reviews
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Approved reviews appear on the customer-facing homepage.
            </Typography>

            <Tabs
                value={statusFilter}
                onChange={(_event, value: ReviewStatusFilter) => dispatch(setReviewsStatusFilter(value))}
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
                        <Typography color="text.secondary">No reviews found.</Typography>
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Reviewer</TableCell>
                                <TableCell>Rating</TableCell>
                                <TableCell>Review</TableCell>
                                <TableCell>Story</TableCell>
                                <TableCell>Submitted</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((review) => {

                                const isBusy = Boolean(moderating[review.id]);

                                return (
                                    <TableRow key={review.id} hover>
                                        <TableCell>
                                            <Typography variant="body2">{review.author}</Typography>
                                            {review.childName && (
                                                <Typography variant="caption" color="text.secondary">
                                                    Parent of {review.childName}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Rating value={review.rating} readOnly size="small" />
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 280 }}>
                                            {review.title && (
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {review.title}
                                                </Typography>
                                            )}
                                            <Typography variant="body2" color="text.secondary">
                                                {review.comment ?? "—"}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{review.storyTheme ?? "—"}</TableCell>
                                        <TableCell>{formatDate(review.createdAt)}</TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={review.status}
                                                color={STATUS_COLOR[review.status] ?? "default"}
                                                sx={{ textTransform: "capitalize" }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="success"
                                                    disabled={isBusy || review.status === "approved"}
                                                    onClick={() => dispatch(moderateReviewRequest(review.id, "approved"))}
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    disabled={isBusy || review.status === "rejected"}
                                                    onClick={() => dispatch(moderateReviewRequest(review.id, "rejected"))}
                                                >
                                                    Reject
                                                </Button>
                                            </Stack>
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

export default Reviews;
