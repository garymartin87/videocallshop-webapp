import {
    CALL_REQUEST_CREATION_REQUESTED,
    CALL_REQUEST_CREATION_SUCCESS,
    CALL_REQUEST_CREATION_FAILED,
} from '../actions/types';

const INITIAL_STATE = {
    isFetching: false,
    callRequest: localStorage.getItem('CALL_REQUEST')
        ? JSON.parse(localStorage.getItem('CALL_REQUEST'))
        : null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CALL_REQUEST_CREATION_REQUESTED:
            return {
                ...state,
                isFetching: true,
            };
        case CALL_REQUEST_CREATION_SUCCESS:
            console.log('::: action.payload', action.payload);
            return {
                ...state,
                callRequest: action.payload,
                isFetching: false,
            };
        case CALL_REQUEST_CREATION_FAILED:
            return {
                ...state,
                isFetching: false,
            };
        default:
            return state;
    }
};
