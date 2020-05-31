import videocallshopApi from '../apis/videocallshop';
import history from '../history';

import { toastr } from 'react-redux-toastr';

import {
    CALL_REQUEST_CREATION_REQUESTED,
    CALL_REQUEST_CREATION_SUCCESS,
    CALL_REQUEST_CREATION_FAILED,
    CALL_REQUEST_REFRESH_STATE_REQUESTED,
    CALL_REQUEST_REFRESH_STATE_FAILED,
    CALL_REQUEST_CANCEL_REQUESTED,
    CALL_REQUEST_CANCEL_SUCCESS,
    CALL_REQUEST_CANCEL_FAILED,
    CALL_REQUEST_REFRESH_STATE_SUCCESS,
} from './types';

// Creation
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

        toastr.error(
            'Error',
            err.response.status === 409 && err.response.data.message
                ? err.response.data.message
                : 'ocurrió un error'
        );
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

// Refresh
export const refreshCallRequestState = () => async (dispatch, getState) => {
    const { callRequest } = getState().callRequest;
    if (!callRequest) {
        toastr.error('Error', 'ocurrió un error');
        return;
    }

    dispatch({
        type: CALL_REQUEST_REFRESH_STATE_REQUESTED,
    });

    try {
        let { data } = await videocallshopApi.get(
            `/stores/${callRequest.storeId}/call-requests/${callRequest.callRequestId}`,
            {
                headers: {
                    Authorization: `Bearer ${callRequest.token}`,
                },
            }
        );
        dispatch(refreshCallRequestStateSuccess(data.data.state));
    } catch (err) {
        dispatch({
            type: CALL_REQUEST_REFRESH_STATE_FAILED,
        });
        toastr.error('Error', 'ocurrió un error');
    }
};

export const refreshCallRequestStateSuccess = (state) => async (
    dispatch,
    getState
) => {
    const { callRequest } = getState().callRequest;

    if (callRequest && callRequest.state !== state) {
        const localStorageCallRequest = JSON.parse(
            localStorage.getItem('CALL_REQUEST')
        );
        localStorageCallRequest.state = state;
        localStorage.setItem(
            'CALL_REQUEST',
            JSON.stringify(localStorageCallRequest)
        );
        dispatch({
            type: CALL_REQUEST_REFRESH_STATE_SUCCESS,
            payload: state,
        });
    }
};

// Cancel
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
            type: CALL_REQUEST_CANCEL_FAILED,
        });
        toastr.error('Error', 'ocurrió un error');
    }
};

export const cancelCallRequestSuccess = () => async (dispatch, getState) => {
    const storedCallRequest = JSON.parse(localStorage.getItem('CALL_REQUEST'));
    console.log(
        '::: callRequestActions cancelCallRequestSuccess storedCallRequest:',
        storedCallRequest
    );
    if (storedCallRequest) {
        localStorage.removeItem('CALL_REQUEST');
        dispatch({
            type: CALL_REQUEST_CANCEL_SUCCESS,
        });

        console.log(
            '::: callRequestActions cancelCallRequestSuccess REDIRECTING HOME'
        );

        history.push('/home');
    }
};
