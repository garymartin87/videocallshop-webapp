import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

import { connect } from 'react-redux';

import { toastr } from 'react-redux-toastr';

import {
    cancelCallRequest,
    cancelCallRequestSuccess,
} from '../actions/callRequestActions';

import { fetchCallByCallRequest } from '../actions/callActions';

import history from '../history';

const WaitingRoom = ({
    cancelCallRequest,
    callRequest,
    hasCall,
    cancelCallRequestSuccess,
    fetchCallByCallRequest,
}) => {
    /*
        STATES
    */
    const [socketConnected, setSocketConnected] = useState(false);
    const [queue, setQueue] = useState([]);

    /*
        HELPER FUNCTIONS
    */

    const submitCancelCallRequest = () => {
        const { storeId, callRequestId } = callRequest.callRequest;
        cancelCallRequest(storeId, callRequestId);
    };

    const getPosition = () => {
        if (callRequest && callRequest.callRequest.callRequestId) {
            return queue.indexOf(callRequest.callRequest.callRequestId.toString()) + 1;
        } else {
            return 0;
        }
    };

    /*
        EFFECTS
    */

    // Socket EFFECT
    useEffect(() => {
        // ToDo: Move this to /api/callRequestSocket.js
        console.log('::: WaitingRoom CONNECTING SOCKET');
        const socket = socketIOClient(
            `${process.env.REACT_APP_API_BASE_URL}?storeId=${callRequest.callRequest.storeId}`,
            {
                path: '/waiting-room-socket',
                cookie: false,
                extraHeaders: {
                    Authorization: `Bearer ${callRequest.callRequest.token}`,
                },
                transportOptions: {
                    polling: {
                        extraHeaders: {
                            Authorization: `Bearer ${callRequest.callRequest.token}`,
                        },
                    },
                },
            }
        );

        socket.on('connect', () => {
            console.log('::: WaitingRoom SOCKET CONNECTED');
            setSocketConnected(true);

            socket.on('disconnect', () => {
                console.log('::: WaitingRoom SOCKET DISCONNECTED');
                setSocketConnected(false);
            });
        });

        socket.on('WAITING_ROOM_SENDED', function (waitingRoom) {
            console.log('::: WaitingRoom WAITING_ROOM_SENDED', waitingRoom);
            setQueue(waitingRoom.queue);
        });

        socket.on('QUEUE_CHANGED', function (queue) {
            console.log('::: WaitingRoom QUEUE_CHANGED', queue);
            setQueue(queue);
        });

        return () => {
            console.log("::: WaitingRoom DISCONNECT SOCKET");
            socket.disconnect();
        };
    }, []);

    // Check no callRequest EFFECT
    useEffect(() => {
        if (!callRequest) {
            history.push('/home');
        }
    }, [callRequest]);

    // Check no callRequest EFFECT
    useEffect(() => {
        if (hasCall) {
            history.push('/call');
        }
    }, [hasCall]);

    // Check State EFFECT
    useEffect(() => {        
        console.log('::: WaitingRoom CHECK STATE EFFECT', callRequest.callRequest.state);

        // eslint-disable-next-line default-case
        switch(callRequest.callRequest.state) {
            case 'PROCESSING_CALL':
                toastr.info('Info', 'Su llamada está siendo procesada.');
                console.log('::: WaitingRoom PROCESSING CALL');
                break;
                
            case 'CALLED':
                toastr.info('Info', 'Ha sido llamado, aguarde un instante.');
                fetchCallByCallRequest(callRequest.callRequest);
                break;

            case 'CANCELLED':
                toastr.info('Info', 'Su llamada fue cancelada.');
                cancelCallRequestSuccess();
                break;
        }
    }, [callRequest]);

    return (
        <div>
            <h1>WaitingRoom</h1>

            <div style={{ textAlign: 'center' }}>
                <h1 style={{ textAlign: 'center' }}>
                    TIENDA ID: {callRequest.callRequest.storeId}
                </h1>
                <h3>{socketConnected ? 'CONNECTED' : 'DISCONNECTED'}</h3>
            </div>
            <hr />
            <h4>MY callRequestId</h4>
            <p>{callRequest.callRequest.callRequestId}</p>

            <h4>INTERVAL ID</h4>
            <p>{callRequest.pollingInterval}</p>

            <h4>Token</h4>
            <p>{callRequest.callRequest.token}</p>

            <h4>POSITION</h4>
            <div>{getPosition()}</div>
            <div>
                <button onClick={submitCancelCallRequest}>Cancelar</button>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        callRequest: state.callRequest,
        hasCall: !!state.call.call,
    };
};

export default connect(
    mapStateToProps,
    {
        cancelCallRequest,
        fetchCallByCallRequest,
        cancelCallRequestSuccess
    } //connect actions creators to the component
)(WaitingRoom);
