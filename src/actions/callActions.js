import videocallshopApi from '../apis/videocallshop';

import {
    CALL_FETCH_REQUESTED,
    CALL_FETCH_SUCCESS,
    CALL_FETCH_FAILED,
} from './types';

// Creation
export const fetchCallByCallRequest = (callRequest) => async (
    dispatch,
    getState
) => {
    console.log('::: callActions fetchCallByCallRequest', callRequest);
    dispatch({
        type: CALL_FETCH_REQUESTED,
    });

    try {
        let { data } = await videocallshopApi.get(
            `/stores/${callRequest.storeId}/calls?callRequestId=${callRequest.callRequestId}`,
            {
                headers: {
                    Authorization: `Bearer ${callRequest.token}`,
                },
            }
        );

        dispatch(fetchCallSuccess(data.data[0]));
    } catch (err) {
        dispatch({
            type: CALL_FETCH_FAILED,
        });
    }
};

export const fetchCallSuccess = (call) => async (dispatch, getState) => {
    localStorage.setItem('CALL', JSON.stringify(call));

    dispatch({
        type: CALL_FETCH_SUCCESS,
        payload: call,
    });
};
