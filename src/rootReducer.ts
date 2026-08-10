import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "./reducer/authReducer";
import ordersReducer from "./reducer/ordersReducer";
import reviewsReducer from "./reducer/reviewsReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    orders: ordersReducer,
    reviews: reviewsReducer
});

export default rootReducer;
