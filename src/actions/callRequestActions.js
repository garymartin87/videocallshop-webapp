import videocallshopApi from '../apis/videocallshop';
import history from '../history';

import { toastr } from 'react-redux-toastr';

import { removeCall } from './callActions';

import {
    CALL_REQUEST_CREATION_REQUESTED,
    CALL_REQUEST_CREATION_SUCCESS,
    CALL_REQUEST_CREATION_FAILED,
    CALL_REQUEST_REFRESH_REQUESTED,
    CALL_REQUEST_REFRESH_FAILED,
    CALL_REQUEST_CANCEL_REQUESTED,
    CALL_REQUEST_CANCEL_SUCCESS,
    CALL_REQUEST_CANCEL_FAILED,
    CALL_REQUEST_FINISH_REQUESTED,
    CALL_REQUEST_FINISH_SUCCESS,
    CALL_REQUEST_FINISH_FAILED,
    CALL_REQUEST_REFRESH_SUCCESS,
    CALL_REQUEST_POLLING_INTERVAL_CREATED,
    CALL_REQUEST_POLLING_INTERVAL_REMOVED
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
                : 'ocurrió un error 1'
        );
    }
};

export const createCallRequestSuccess = (callRequest) => async (
    dispatch,
    getState
) => {
    // create call request
    localStorage.setItem('CALL_REQUEST', JSON.stringify(callRequest));
    dispatch({
        type: CALL_REQUEST_CREATION_SUCCESS,
        payload: callRequest,
    });

    // create polling interval
    dispatch(storePollingInterval());

    history.push('/waiting-room');
};

// Refresh
export const refreshCallRequest = () => async (dispatch, getState) => {
    const { callRequest } = getState().callRequest;
    if (!callRequest) {
        return;
    }

    dispatch({
        type: CALL_REQUEST_REFRESH_REQUESTED,
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
        dispatch(refreshCallRequestSuccess(data.data));
    } catch (err) {
        dispatch({
            type: CALL_REQUEST_REFRESH_FAILED,
        });
        toastr.error('Error', 'ocurrió un error 3');
    }
};

export const refreshCallRequestSuccess = (newCallRequest) => async (
    dispatch,
    getState
) => {
    const { callRequest } = getState().callRequest;

    try {
        localStorage.setItem(
            'CALL_REQUEST',
            JSON.stringify({ ...callRequest, ...newCallRequest }) // Keep the token
        );
    } catch (err) {
        console.log(err);
    }

    dispatch({
        type: CALL_REQUEST_REFRESH_SUCCESS,
        payload: newCallRequest,
    });
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
        toastr.error('Error', 'ocurrió un error 4');

        // Anyway cancel call request
        dispatch(cancelCallRequestSuccess());
    }
};

export const cancelCallRequestSuccess = () => async (dispatch, getState) => {
    dispatch(removeCallRequest());

    // remove call
    dispatch(removeCall());

    dispatch({
        type: CALL_REQUEST_CANCEL_SUCCESS,
    });

    history.push('/home');
};

// Finish
export const finishCallRequest = (storeId, callRequestId) => async (
    dispatch,
    getState
) => {
    dispatch({
        type: CALL_REQUEST_FINISH_REQUESTED,
    });

    try {
        const { callRequest } = getState().callRequest;

        let { data } = await videocallshopApi.patch(
            `/stores/${storeId}/call-requests/${callRequestId}`,
            {
                status: 'FINISHED'
            },
            {
                headers: {
                    Authorization: `Bearer ${callRequest.token}`,
                },
            }
        );
        dispatch(finishCallRequestSuccess(data.data));
    } catch (err) {
        dispatch({
            type: CALL_REQUEST_FINISH_FAILED,
        });
        toastr.error('Error', 'ocurrió un error 4');

        // Anyway finish call request
        dispatch(finishCallRequestSuccess()); // 
    }
};

export const finishCallRequestSuccess = (storeId, callRequestId) => async (
    dispatch,
    getState
) => {
    dispatch(removeCallRequest());

    // remove call
    dispatch(removeCall());

    dispatch({
        type: CALL_REQUEST_FINISH_SUCCESS
    });

    history.push('/home');
};

// Utils
const removeCallRequest = () => async (
    dispatch,
    getState
) => {
    // destroy polling interval
    dispatch(removePollingInterval());
    
    // remove stored call request
    try {
        localStorage.removeItem('CALL_REQUEST');
    } catch(err) {
        console.log('No stored callRequest');
    }
};

// Polling
export const storePollingInterval = (intervalId) => async (
    dispatch,
    getState
) => {
    console.log("::: CREATING POLLING INTERVAL");
    const intervalId = setInterval(() => {
        const { callRequest } = getState();
        console.log('::: INTERVAL FIRED isAlreadyFetching', callRequest.isFetching);
        if(!callRequest.isFetching) {
            dispatch(refreshCallRequest()) 
        }
    }, 5000);

    dispatch({
        type: CALL_REQUEST_POLLING_INTERVAL_CREATED,
        payload: intervalId
    });
};

export const removePollingInterval = () => async (
    dispatch,
    getState
) => {
    const { callRequest } = getState();
    if(callRequest.pollingInterval) {
        console.log('::: CLEARING INTERVAL');
        clearInterval(callRequest.pollingInterval);
        dispatch({
            type: CALL_REQUEST_POLLING_INTERVAL_REMOVED
        });
    }
};