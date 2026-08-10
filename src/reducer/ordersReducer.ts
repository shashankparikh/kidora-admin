import * as types from "../actions/ordersActionTypes";
import type { OrdersAction } from "../actions/ordersActions";
import type { AdminOrder, OrderStatusFilter } from "../types/order";

export type OrdersState = {
    items: AdminOrder[];
    statusFilter: OrderStatusFilter;
    loading: boolean;
    error: string | null;
};

const initialState: OrdersState = {
    items: [],
    statusFilter: "all",
    loading: false,
    error: null
};

export default function ordersReducer(state = initialState, action: OrdersAction): OrdersState {
    switch (action.type) {

        case types.SET_ORDERS_STATUS_FILTER:
            return { ...state, statusFilter: action.payload.status };

        case types.FETCH_ORDERS_REQUEST:
            return { ...state, loading: true, error: null };

        case types.FETCH_ORDERS_SUCCESS:
            return { ...state, loading: false, items: action.payload.orders };

        case types.FETCH_ORDERS_FAILURE:
            return { ...state, loading: false, error: action.payload.message };

        default:
            return state;
    }
}
