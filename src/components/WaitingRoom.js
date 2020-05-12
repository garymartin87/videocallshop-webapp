import React, { useEffect } from 'react';
import socketIOClient from 'socket.io-client';

import { connect } from 'react-redux';

const WaitingRoom = ({ callRequest }) => {
    useEffect(() => {
        // ToDo: Move this to /api/callRequestSocket.js
        const socket = socketIOClient(
            `${process.env.REACT_APP_API_BASE_URL}?storeId=1`,
            {
                path: '/waiting-room-socket',
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
        socket.on('FromAPI', (data) => {
            console.log(data);
        });
    }, [callRequest]);

    return (
        <div>
            <h1>WaitingRoom</h1>
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
    {} //connect actions creators to the component
)(WaitingRoom);
