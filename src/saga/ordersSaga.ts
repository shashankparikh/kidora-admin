import { call, put, takeLatest } from "redux-saga/effects";
import type { AxiosResponse } from "axios";
import axios from "axios";

import * as types from "../actions/ordersActionTypes";
import { fetchOrdersSuccess, fetchOrdersFailure, fetchOrdersRequest } from "../actions/ordersActions";
import api from "../services/api";
import type { AdminOrder } from "../types/order";

type ListOrdersResponse = {
    success: boolean;
    orders: AdminOrder[];
    message?: string;
};

function* handleFetchOrders(action: ReturnType<typeof fetchOrdersRequest>) {
    try {

        const { status } = action.payload;

        const response: AxiosResponse<ListOrdersResponse> = yield call(
            api.get,
            "/admin/orders",
            { params: status && status !== "all" ? { status } : undefined }
        );

        yield put(fetchOrdersSuccess(response.data.orders));

    } catch (error) {

        const message = axios.isAxiosError<ListOrdersResponse>(error) && error.response?.data?.message
            ? error.response.data.message
            : "Couldn't load orders.";

        yield put(fetchOrdersFailure(message));

    }
}

export default function* ordersSaga() {
    yield takeLatest(types.FETCH_ORDERS_REQUEST, handleFetchOrders);
}
