import {
    CALL_FETCH_REQUESTED,
    CALL_FETCH_SUCCESS,
    CALL_FETCH_FAILED,
    CALL_REMOVE_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
    isFetching: false,
    call: localStorage.getItem('CALL')
        ? JSON.parse(localStorage.getItem('CALL'))
        : null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // Creation
        case CALL_FETCH_REQUESTED:
            return {
                ...state,
                isFetching: true,
            };
        case CALL_FETCH_SUCCESS:
            return {
                ...state,
                call: action.payload,
                isFetching: false,
            };
        case CALL_FETCH_FAILED:
            return {
                ...state,
                isFetching: false,
            };
        case CALL_REMOVE_SUCCESS:
            return INITIAL_STATE;
        default:
            return state;
    }
};
