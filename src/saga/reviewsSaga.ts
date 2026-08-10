import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import type { AxiosResponse } from "axios";
import axios from "axios";

import * as types from "../actions/reviewsActionTypes";
import {
    fetchReviewsRequest,
    fetchReviewsSuccess,
    fetchReviewsFailure,
    moderateReviewRequest,
    moderateReviewSuccess,
    moderateReviewFailure
} from "../actions/reviewsActions";
import api from "../services/api";
import type { AdminReview } from "../types/review";

type ListReviewsResponse = { success: boolean; reviews: AdminReview[]; message?: string };
type ModerateReviewResponse = { success: boolean; review: AdminReview; message?: string };

function* handleFetchReviews(action: ReturnType<typeof fetchReviewsRequest>) {
    try {

        const { status } = action.payload;

        const response: AxiosResponse<ListReviewsResponse> = yield call(
            api.get,
            "/admin/reviews",
            { params: status && status !== "all" ? { status } : undefined }
        );

        yield put(fetchReviewsSuccess(response.data.reviews));

    } catch (error) {

        const message = axios.isAxiosError<ListReviewsResponse>(error) && error.response?.data?.message
            ? error.response.data.message
            : "Couldn't load reviews.";

        yield put(fetchReviewsFailure(message));

    }
}

function* handleModerateReview(action: ReturnType<typeof moderateReviewRequest>) {
    try {

        const { reviewId, status } = action.payload;

        const response: AxiosResponse<ModerateReviewResponse> = yield call(
            api.patch,
            `/admin/reviews/${reviewId}`,
            { status }
        );

        yield put(moderateReviewSuccess(response.data.review));

    } catch (error) {

        const message = axios.isAxiosError<ModerateReviewResponse>(error) && error.response?.data?.message
            ? error.response.data.message
            : "Couldn't update this review.";

        yield put(moderateReviewFailure(action.payload.reviewId, message));

    }
}

export default function* reviewsSaga() {
    yield takeLatest(types.FETCH_REVIEWS_REQUEST, handleFetchReviews);
    yield takeEvery(types.MODERATE_REVIEW_REQUEST, handleModerateReview);
}
