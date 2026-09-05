import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "./reducer/authReducer";
import ordersReducer from "./reducer/ordersReducer";
import reviewsReducer from "./reducer/reviewsReducer";
import settingsReducer from "./reducer/settingsReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    orders: ordersReducer,
    reviews: reviewsReducer,
    settings: settingsReducer
});

export default rootReducer;
