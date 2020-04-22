const INITIAL_STATE = {
    isFetching: false,
    callRequest: localStorage.getItem('CALL_REQUEST')
        ? localStorage.getItem('CALL_REQUEST')
        : null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        default:
            return state;
    }
};
