import * as types from "./paymentsActionTypes";
import type { AdminPayment } from "../types/payment";

export const fetchPaymentsRequest = () => ({
    type: types.FETCH_PAYMENTS_REQUEST
} as const);

export const fetchPaymentsSuccess = (payments: AdminPayment[]) => ({
    type: types.FETCH_PAYMENTS_SUCCESS,
    payload: { payments }
} as const);

export const fetchPaymentsFailure = (message: string) => ({
    type: types.FETCH_PAYMENTS_FAILURE,
    payload: { message }
} as const);

export const refundPaymentRequest = (paymentId: string) => ({
    type: types.REFUND_PAYMENT_REQUEST,
    payload: { paymentId }
} as const);

export const refundPaymentSuccess = (paymentId: string) => ({
    type: types.REFUND_PAYMENT_SUCCESS,
    payload: { paymentId }
} as const);

export const refundPaymentFailure = (paymentId: string, message: string) => ({
    type: types.REFUND_PAYMENT_FAILURE,
    payload: { paymentId, message }
} as const);

export type PaymentsAction =
    | ReturnType<typeof fetchPaymentsRequest>
    | ReturnType<typeof fetchPaymentsSuccess>
    | ReturnType<typeof fetchPaymentsFailure>
    | ReturnType<typeof refundPaymentRequest>
    | ReturnType<typeof refundPaymentSuccess>
    | ReturnType<typeof refundPaymentFailure>;
