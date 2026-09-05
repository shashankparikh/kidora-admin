import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import type { AxiosResponse } from "axios";
import axios from "axios";

import * as types from "../actions/paymentsActionTypes";
import {
    fetchPaymentsSuccess,
    fetchPaymentsFailure,
    refundPaymentSuccess,
    refundPaymentFailure,
    refundPaymentRequest
} from "../actions/paymentsActions";
import api from "../services/api";
import type { AdminPayment } from "../types/payment";

type ListPaymentsResponse = {
    success: boolean;
    payments: AdminPayment[];
    message?: string;
};

type RefundResponse = {
    success: boolean;
    refunded?: boolean;
    refundId?: string;
    // Set when refunded is false but the request still succeeded (HTTP
    // 200) — e.g. the automatic sweep claimed this exact payment a
    // second before this click landed. See kidora-be's
    // paymentService.refundOrphanedPayment.
    reason?: string;
    message?: string;
};

function* handleFetchPayments() {
    try {

        const response: AxiosResponse<ListPaymentsResponse> = yield call(api.get, "/admin/payments");

        yield put(fetchPaymentsSuccess(response.data.payments));

    } catch (error) {

        const message = axios.isAxiosError<ListPaymentsResponse>(error) && error.response?.data?.message
            ? error.response.data.message
            : "Couldn't load payments.";

        yield put(fetchPaymentsFailure(message));

    }
}

// takeEvery, not takeLatest — refunding payment A should never be
// cancelled by a click to refund payment B; each row's refund is
// independent (paymentsReducer tracks in-flight ids per payment, not one
// shared flag, to match).
function* handleRefundPayment(action: ReturnType<typeof refundPaymentRequest>) {

    const { paymentId } = action.payload;

    try {

        const response: AxiosResponse<RefundResponse> = yield call(
            api.post,
            `/admin/payments/${paymentId}/refund`
        );

        if (!response.data.refunded) {
            // A 200 that isn't actually a refund (e.g. the automatic
            // sweep beat this click to the same payment) — surfaced as a
            // failure in the UI even though the HTTP call itself
            // succeeded, since nothing this click asked for happened.
            throw new Error(response.data.reason || response.data.message || "This payment couldn't be refunded.");
        }

        yield put(refundPaymentSuccess(paymentId));

    } catch (error) {

        const message = axios.isAxiosError<RefundResponse>(error) && error.response?.data?.message
            ? error.response.data.message
            : (error instanceof Error ? error.message : "Couldn't process the refund.");

        yield put(refundPaymentFailure(paymentId, message));

    }

}

export default function* paymentsSaga() {
    yield takeLatest(types.FETCH_PAYMENTS_REQUEST, handleFetchPayments);
    yield takeEvery(types.REFUND_PAYMENT_REQUEST, handleRefundPayment);
}
