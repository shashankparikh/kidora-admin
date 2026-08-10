import * as types from "./ordersActionTypes";
import type { AdminOrder, OrderStatusFilter } from "../types/order";

export const fetchOrdersRequest = (status?: OrderStatusFilter) => ({
    type: types.FETCH_ORDERS_REQUEST,
    payload: { status }
} as const);

export const fetchOrdersSuccess = (orders: AdminOrder[]) => ({
    type: types.FETCH_ORDERS_SUCCESS,
    payload: { orders }
} as const);

export const fetchOrdersFailure = (message: string) => ({
    type: types.FETCH_ORDERS_FAILURE,
    payload: { message }
} as const);

export const setOrdersStatusFilter = (status: OrderStatusFilter) => ({
    type: types.SET_ORDERS_STATUS_FILTER,
    payload: { status }
} as const);

export type OrdersAction =
    | ReturnType<typeof fetchOrdersRequest>
    | ReturnType<typeof fetchOrdersSuccess>
    | ReturnType<typeof fetchOrdersFailure>
    | ReturnType<typeof setOrdersStatusFilter>;
