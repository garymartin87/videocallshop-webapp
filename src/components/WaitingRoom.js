import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

import { connect } from 'react-redux';

import { toastr } from 'react-redux-toastr';

import { Row, Col, Button } from 'react-bootstrap';
import { FaTimes, FaSpinner } from 'react-icons/fa';

import {
    cancelCallRequest,
    cancelCallRequestSuccess,
} from '../actions/callRequestActions';

import StoreHeader from './StoreHeader';

import {
    fetchStores
} from '../actions/storeActions';

import { fetchCallByCallRequest } from '../actions/callActions';

import history from '../history';

const WaitingRoom = ({
    cancelCallRequest,
    callRequest,
    store,
    hasCall,
    fetchStores,
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

    // Check store info EFFECT
    useEffect(() => {
        if(!store) {
            fetchStores();
        }
    }, []);

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
        <>
            <StoreHeader store={store} />  
            <Row className='text-center'>
                <Col md={{ span: 6, offset: 3 }} xs={{ span: 12, offset: 0 }}>
                    <h4>Usted se encuentra en la fila para ser atendido</h4>
                    <h5>Su posición es</h5>
                    <div style={{ fontSize: '130px' }}>{getPosition()}</div>
                    { callRequest.isFetching && <div className="text-info"><FaSpinner/> Verificando estado...</div> }
                </Col>
            </Row>
            <Row className='container text-right fixed-bottom row' style={{ marginBottom: '40px' }}>
                <Col md={{ span: 12, offset: 0 }} xs={{ span: 12, offset: 0 }}>
                    <Button
                        href="#" 
                        className="btn-warning float-right" 
                        onClick={submitCancelCallRequest}
                    >
                        <FaTimes /> Salir de la fila
                    </Button>
                </Col>
            </Row>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        callRequest: state.callRequest,
        store: state.stores.stores[state.callRequest.callRequest.storeId],
        hasCall: !!state.call.call,
    };
};

export default connect(
    mapStateToProps,
    {
        cancelCallRequest,
        fetchCallByCallRequest,
        cancelCallRequestSuccess,
        fetchStores
    } //connect actions creators to the component
)(WaitingRoom);
