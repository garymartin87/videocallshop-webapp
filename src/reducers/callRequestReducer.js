import {
    CALL_REQUEST_CREATION_REQUESTED,
    CALL_REQUEST_CREATION_SUCCESS,
    CALL_REQUEST_CREATION_FAILED,
    CALL_REQUEST_CANCEL_REQUESTED,
    CALL_REQUEST_CANCEL_SUCCESS,
    CALL_REQUEST_CANCEL_FAILED,
    CALL_REQUEST_REFRESH_STATE_REQUESTED,
    CALL_REQUEST_REFRESH_STATE_SUCCESS,
    CALL_REQUEST_REFRESH_STATE_FAILED,
    CALL_REQUEST_FINISH_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
    isFetching: false,
    callRequest: localStorage.getItem('CALL_REQUEST')
        ? JSON.parse(localStorage.getItem('CALL_REQUEST'))
        : null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // Creation
        case CALL_REQUEST_CREATION_REQUESTED:
        case CALL_REQUEST_REFRESH_STATE_REQUESTED:
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
        case CALL_REQUEST_REFRESH_STATE_SUCCESS:
            return {
                callRequest: {
                    ...state.callRequest,
                    state: action.payload
                },
                isFetching: false
            };
        case CALL_REQUEST_CREATION_FAILED:
        case CALL_REQUEST_REFRESH_STATE_FAILED:
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
            return INITIAL_STATE;
        case CALL_REQUEST_CANCEL_FAILED:
            return {
                ...state,
                isFetching: false,
            };
        case CALL_REQUEST_FINISH_SUCCESS:
            return INITIAL_STATE;
        default:
            return state;
    }
};
