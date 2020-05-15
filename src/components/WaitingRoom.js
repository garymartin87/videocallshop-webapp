import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

import { connect } from 'react-redux';

import { cancelCallRequest } from '../actions/callRequestActions';

const WaitingRoom = ({ cancelCallRequest, callRequest }) => {
    const [socketConnected, setSocketConnected] = useState(false);
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        // ToDo: Move this to /api/callRequestSocket.js
        console.log('::: CONNECTING SOCKET');
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
            console.log('::: SOCKET CONNECTED');
            setSocketConnected(true);

            socket.on('disconnect', () => {
                console.log('::: SOCKET DISCONNECTED');
                setSocketConnected(false);
            });
        });

        socket.on('WAITING_ROOM_SENDED', function (waitingRoom) {
            console.log('::: WAITING_ROOM_SENDED', waitingRoom);
            setQueue(waitingRoom.queue);
        });

        socket.on('QUEUE_CHANGED', function (queue) {
            console.log('::: QUEUE_CHANGED', queue);
            setQueue(queue);
        });
    }, []);

    console.log(
        '::: queue',
        queue,
        callRequest.callRequest.callRequestId,
        socketConnected
    );

    const submitCancelCallRequest = () => {
        const { storeId, callRequestId } = callRequest.callRequest;
        cancelCallRequest(storeId, callRequestId);
    };

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

            <h4>Token</h4>
            <p>{callRequest.callRequest.token}</p>

            <h4>POSITION</h4>
            <div>
                {queue.indexOf(
                    callRequest.callRequest.callRequestId.toString()
                ) + 1}
            </div>
            <div>
                <button onClick={submitCancelCallRequest}>Cancelar</button>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        callRequest: state.callRequest,
    };
};

export default connect(
    mapStateToProps,
    { cancelCallRequest } //connect actions creators to the component
)(WaitingRoom);
