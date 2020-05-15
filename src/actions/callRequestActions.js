import videocallshopApi from '../apis/videocallshop';
import history from '../history';

import { toastr } from 'react-redux-toastr';

import {
    CALL_REQUEST_CREATION_REQUESTED,
    CALL_REQUEST_CREATION_SUCCESS,
    CALL_REQUEST_CREATION_FAILED,
    CALL_REQUEST_CANCEL_REQUESTED,
    CALL_REQUEST_CANCEL_SUCCESS,
    CALL_REQUEST_CANCEL_FAILED,
} from './types';

export const createCallRequest = (storeId, email, name, lastName) => async (
    dispatch,
    getState
) => {
    dispatch({
        type: CALL_REQUEST_CREATION_REQUESTED,
    });

    try {
        const params = { email, name, lastName };
        let { data } = await videocallshopApi.post(
            `/stores/${storeId}/call-requests`,
            params
        );

        dispatch(createCallRequestSuccess(data.data));
    } catch (err) {
        dispatch({
            type: CALL_REQUEST_CREATION_FAILED,
        });
        toastr.error('Error', 'ocurrió un error');
    }
};

export const createCallRequestSuccess = (callRequest) => async (
    dispatch,
    getState
) => {
    localStorage.setItem('CALL_REQUEST', JSON.stringify(callRequest));

    dispatch({
        type: CALL_REQUEST_CREATION_SUCCESS,
        payload: callRequest,
    });

    history.push('/waiting-room');
};

export const cancelCallRequest = (storeId, callRequestId) => async (
    dispatch,
    getState
) => {
    dispatch({
        type: CALL_REQUEST_CANCEL_REQUESTED,
    });

    try {
        const { callRequest } = getState().callRequest;

        let { data } = await videocallshopApi.delete(
            `/stores/${storeId}/call-requests/${callRequestId}`,
            {
                headers: {
                    Authorization: `Bearer ${callRequest.token}`,
                },
            }
        );
        dispatch(cancelCallRequestSuccess(data.data));
    } catch (err) {
        dispatch({
            type: CALL_REQUEST_CREATION_FAILED,
        });
        toastr.error('Error', 'ocurrió un error');
    }
};

export const cancelCallRequestSuccess = () => async (dispatch, getState) => {
    localStorage.removeItem('CALL_REQUEST');

    dispatch({
        type: CALL_REQUEST_CANCEL_SUCCESS,
    });

    history.push('/thanks');
};
