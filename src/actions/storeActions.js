import videocallshopApi from '../apis/videocallshop';

import { toastr } from 'react-redux-toastr';

import {
    STORES_FETCH_REQUESTED,
    STORES_FETCH_SUCCESS,
    STORES_FETCH_FAILED
} from './types';

export const fetchStores = () => async (
    dispatch,
    getState
) => {
    dispatch({
        type: STORES_FETCH_REQUESTED,
    });

    try {
        let { data } = await videocallshopApi.get('/stores');

        dispatch({
            type: STORES_FETCH_SUCCESS,
            payload: data.data
        });
    } catch (err) {
        dispatch({
            type: STORES_FETCH_FAILED,
        });

        toastr.error(
            'Error', 'ocurrió un error'
        );
    }
};