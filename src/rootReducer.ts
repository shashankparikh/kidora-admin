import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "./reducer/authReducer";
import ordersReducer from "./reducer/ordersReducer";
import reviewsReducer from "./reducer/reviewsReducer";
import paymentsReducer from "./reducer/paymentsReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    orders: ordersReducer,
    reviews: reviewsReducer,
    payments: paymentsReducer
});

export default rootReducer;
