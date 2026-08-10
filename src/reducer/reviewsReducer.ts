import * as types from "../actions/reviewsActionTypes";
import type { ReviewsAction } from "../actions/reviewsActions";
import type { AdminReview, ReviewStatusFilter } from "../types/review";

export type ReviewsState = {
    items: AdminReview[];
    statusFilter: ReviewStatusFilter;
    loading: boolean;
    error: string | null;
    // reviewId -> true while a moderate action is in flight, so only that
    // row's buttons show busy instead of freezing the whole table.
    moderating: Record<string, boolean>;
};

const initialState: ReviewsState = {
    items: [],
    statusFilter: "pending",
    loading: false,
    error: null,
    moderating: {}
};

export default function reviewsReducer(state = initialState, action: ReviewsAction): ReviewsState {
    switch (action.type) {

        case types.SET_REVIEWS_STATUS_FILTER:
            return { ...state, statusFilter: action.payload.status };

        case types.FETCH_REVIEWS_REQUEST:
            return { ...state, loading: true, error: null };

        case types.FETCH_REVIEWS_SUCCESS:
            return { ...state, loading: false, items: action.payload.reviews };

        case types.FETCH_REVIEWS_FAILURE:
            return { ...state, loading: false, error: action.payload.message };

        case types.MODERATE_REVIEW_REQUEST:
            return {
                ...state,
                moderating: { ...state.moderating, [action.payload.reviewId]: true }
            };

        case types.MODERATE_REVIEW_SUCCESS: {

            const nextModerating = { ...state.moderating };
            delete nextModerating[action.payload.review.id];

            // The moderated review usually no longer matches the current
            // filter (it just left "pending"), so drop it from the list
            // rather than showing a stale status until the next refetch.
            const stillMatches = state.statusFilter === "all" || state.statusFilter === action.payload.review.status;

            return {
                ...state,
                moderating: nextModerating,
                items: stillMatches
                    ? state.items.map((review) => (review.id === action.payload.review.id ? action.payload.review : review))
                    : state.items.filter((review) => review.id !== action.payload.review.id)
            };

        }

        case types.MODERATE_REVIEW_FAILURE: {
            const nextModerating = { ...state.moderating };
            delete nextModerating[action.payload.reviewId];
            return { ...state, moderating: nextModerating, error: action.payload.message };
        }

        default:
            return state;
    }
}
