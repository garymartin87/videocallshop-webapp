import videocallshopApi from '../apis/videocallshop';
import history from '../history';

import { toastr } from 'react-redux-toastr';

import { removeCall } from './callActions';

import {
    CALL_REQUEST_CREATION_REQUESTED,
    CALL_REQUEST_CREATION_SUCCESS,
    CALL_REQUEST_CREATION_FAILED,
    CALL_REQUEST_REFRESH_STATE_REQUESTED,
    CALL_REQUEST_REFRESH_STATE_FAILED,
    CALL_REQUEST_CANCEL_REQUESTED,
    CALL_REQUEST_CANCEL_SUCCESS,
    CALL_REQUEST_CANCEL_FAILED,
    CALL_REQUEST_FINISH_SUCCESS,
    CALL_REQUEST_REFRESH_STATE_SUCCESS,
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
export const refreshCallRequestState = () => async (dispatch, getState) => {
    const { callRequest } = getState().callRequest;
    if (!callRequest) {
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
        toastr.error('Error', 'ocurrió un error 3');
    }
};

export const refreshCallRequestStateSuccess = (state) => async (
    dispatch,
    getState
) => {
    const { callRequest } = getState().callRequest;

    try {
        const localStorageCallRequest = JSON.parse(
            localStorage.getItem('CALL_REQUEST')
        );
        localStorageCallRequest.state = state;
        localStorage.setItem(
            'CALL_REQUEST',
            JSON.stringify(localStorageCallRequest)
        );
    } catch (err) {
        console.log(err);
        console.log('callRequest.state', callRequest.state);
        console.log('new state', state);
    }

    dispatch({
        type: CALL_REQUEST_REFRESH_STATE_SUCCESS,
        payload: state,
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
            dispatch(refreshCallRequestState()) 
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