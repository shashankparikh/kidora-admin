import { all, fork } from "redux-saga/effects";

import authSaga from "./saga/authSaga";
import ordersSaga from "./saga/ordersSaga";
import reviewsSaga from "./saga/reviewsSaga";

export default function* rootSaga() {
    yield all([
        fork(authSaga),
        fork(ordersSaga),
        fork(reviewsSaga)
    ]);
}
