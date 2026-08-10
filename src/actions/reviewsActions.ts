import * as types from "./reviewsActionTypes";
import type { AdminReview, ReviewStatus, ReviewStatusFilter } from "../types/review";

export const fetchReviewsRequest = (status?: ReviewStatusFilter) => ({
    type: types.FETCH_REVIEWS_REQUEST,
    payload: { status }
} as const);

export const fetchReviewsSuccess = (reviews: AdminReview[]) => ({
    type: types.FETCH_REVIEWS_SUCCESS,
    payload: { reviews }
} as const);

export const fetchReviewsFailure = (message: string) => ({
    type: types.FETCH_REVIEWS_FAILURE,
    payload: { message }
} as const);

export const setReviewsStatusFilter = (status: ReviewStatusFilter) => ({
    type: types.SET_REVIEWS_STATUS_FILTER,
    payload: { status }
} as const);

export const moderateReviewRequest = (reviewId: string, status: ReviewStatus) => ({
    type: types.MODERATE_REVIEW_REQUEST,
    payload: { reviewId, status }
} as const);

export const moderateReviewSuccess = (review: AdminReview) => ({
    type: types.MODERATE_REVIEW_SUCCESS,
    payload: { review }
} as const);

export const moderateReviewFailure = (reviewId: string, message: string) => ({
    type: types.MODERATE_REVIEW_FAILURE,
    payload: { reviewId, message }
} as const);

export type ReviewsAction =
    | ReturnType<typeof fetchReviewsRequest>
    | ReturnType<typeof fetchReviewsSuccess>
    | ReturnType<typeof fetchReviewsFailure>
    | ReturnType<typeof setReviewsStatusFilter>
    | ReturnType<typeof moderateReviewRequest>
    | ReturnType<typeof moderateReviewSuccess>
    | ReturnType<typeof moderateReviewFailure>;
