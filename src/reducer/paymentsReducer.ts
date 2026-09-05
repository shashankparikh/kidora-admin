import * as types from "../actions/paymentsActionTypes";
import type { PaymentsAction } from "../actions/paymentsActions";
import type { AdminPayment } from "../types/payment";

export type PaymentsState = {
    items: AdminPayment[];
    loading: boolean;
    error: string | null;
    // Which payment ids currently have a refund in flight — a Set-like
    // array rather than one global "refunding" flag, since refunding one
    // stuck payment should never disable the button on another row (see
    // saga/paymentsSaga.ts's takeEvery, not takeLatest, for the matching
    // half of this).
    refundingIds: string[];
    refundError: string | null;
};

const initialState: PaymentsState = {
    items: [],
    loading: false,
    error: null,
    refundingIds: [],
    refundError: null
};

export default function paymentsReducer(state = initialState, action: PaymentsAction): PaymentsState {
    switch (action.type) {

        case types.FETCH_PAYMENTS_REQUEST:
            return { ...state, loading: true, error: null };

        case types.FETCH_PAYMENTS_SUCCESS:
            return { ...state, loading: false, items: action.payload.payments };

        case types.FETCH_PAYMENTS_FAILURE:
            return { ...state, loading: false, error: action.payload.message };

        case types.REFUND_PAYMENT_REQUEST:
            return {
                ...state,
                refundError: null,
                refundingIds: [...state.refundingIds, action.payload.paymentId]
            };

        case types.REFUND_PAYMENT_SUCCESS:
            return {
                ...state,
                refundingIds: state.refundingIds.filter((id) => id !== action.payload.paymentId),
                // Updated in place rather than re-fetching the whole list —
                // kidora-be's refund endpoint doesn't return the full
                // updated payment row, but we already know exactly what
                // changed (this is the one and only transition a
                // successful refund can cause).
                items: state.items.map((payment) =>
                    payment.id === action.payload.paymentId
                        ? { ...payment, status: "refunded", displayStatus: "refund_completed" }
                        : payment
                )
            };

        case types.REFUND_PAYMENT_FAILURE:
            return {
                ...state,
                refundingIds: state.refundingIds.filter((id) => id !== action.payload.paymentId),
                refundError: action.payload.message
            };

        default:
            return state;
    }
}
