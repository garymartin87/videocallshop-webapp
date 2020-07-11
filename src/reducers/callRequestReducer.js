import {
    CALL_REQUEST_CREATION_REQUESTED,
    CALL_REQUEST_CREATION_SUCCESS,
    CALL_REQUEST_CREATION_FAILED,
    CALL_REQUEST_CANCEL_REQUESTED,
    CALL_REQUEST_CANCEL_SUCCESS,
    CALL_REQUEST_CANCEL_FAILED,
    CALL_REQUEST_REFRESH_REQUESTED,
    CALL_REQUEST_REFRESH_SUCCESS,
    CALL_REQUEST_REFRESH_FAILED,
    CALL_REQUEST_FINISH_SUCCESS,
    CALL_REQUEST_POLLING_INTERVAL_CREATED,
    CALL_REQUEST_POLLING_INTERVAL_REMOVED
} from '../actions/types';

const INITIAL_STATE = {
    isFetching: false,
    callRequest: localStorage.getItem('CALL_REQUEST')
        ? JSON.parse(localStorage.getItem('CALL_REQUEST'))
        : null,
    pollingInterval: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // Creation
        case CALL_REQUEST_CREATION_REQUESTED:
        case CALL_REQUEST_REFRESH_REQUESTED:
            return {
                ...state,
                isFetching: true,
            };
        case CALL_REQUEST_CREATION_SUCCESS:
            return {
                ...state,
                callRequest: action.payload,
                isFetching: false,
            };
        case CALL_REQUEST_REFRESH_SUCCESS:
            return {
                ...state,
                callRequest: {
                    ...state.callRequest, // Keep the token
                    ...action.payload
                },
                isFetching: false
            };
        case CALL_REQUEST_CREATION_FAILED:
        case CALL_REQUEST_REFRESH_FAILED:
            return {
                ...state,
                isFetching: false,
            };
        // Cancel
        case CALL_REQUEST_CANCEL_REQUESTED:
            return {
                ...state,
                isFetching: true,
            };
        case CALL_REQUEST_CANCEL_SUCCESS:
            return {
                ...state,
                callRequest: null
            };
        case CALL_REQUEST_CANCEL_FAILED:
            return {
                ...state,
                isFetching: false,
            };
        case CALL_REQUEST_FINISH_SUCCESS:
            return {
                ...state,
                callRequest: null
            };
        case CALL_REQUEST_POLLING_INTERVAL_CREATED:
            return {
                ...state,
                pollingInterval: action.payload,
            };
        case CALL_REQUEST_POLLING_INTERVAL_REMOVED:
                return {
                    ...state,
                    pollingInterval: null,
                };
        default:
            return state;
    }
};
