import videocallshopApi from '../apis/videocallshop';
import history from '../history';

import { toastr } from 'react-redux-toastr';

import {
    CALL_REQUEST_CREATION_REQUESTED,
    CALL_REQUEST_CREATION_SUCCESS,
    CALL_REQUEST_CREATION_FAILED,
} from './types';

export const createCallRequest = (email, name, lastName) => async (
    dispatch,
    getState
) => {
    dispatch({
        type: CALL_REQUEST_CREATION_REQUESTED,
    });

    try {
        const params = { email, name, lastName };
        let { data } = await videocallshopApi.post(
            '/stores/1/call-requests',
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
