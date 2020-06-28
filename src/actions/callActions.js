import videocallshopApi from '../apis/videocallshop';

import history from '../history';

import {
    CALL_FETCH_REQUESTED,
    CALL_FETCH_SUCCESS,
    CALL_FETCH_FAILED,
    CALL_REMOVE_SUCCESS
} from './types';

// Creation
export const fetchCallByCallRequest = (callRequest) => async (
    dispatch,
    getState
) => {
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

        history.push('/waiting-room');
    }
};

export const fetchCallSuccess = (call) => async (dispatch, getState) => {
    console.log('::: callActions fetchCallSuccess');
    localStorage.setItem('CALL', JSON.stringify(call));

    dispatch({
        type: CALL_FETCH_SUCCESS,
        payload: call,
    });

    history.push('/call');
};

export const removeCall = () => async (dispatch, getState) => {
    try {
        localStorage.removeItem('CALL');
    } catch (err) {
        console.log('No Call');
    }

    dispatch({
        type: CALL_REMOVE_SUCCESS,
    });
};