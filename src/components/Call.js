import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';

import { Row, Col, Navbar, Button } from 'react-bootstrap';

import history from '../history';

import {
    cancelCallRequestSuccess,
    finishCallRequestSuccess,
    finishCallRequest
} from '../actions/callRequestActions';

import { toastr } from 'react-redux-toastr';

const Call = ({
    callRequest,
    call,
    cancelCallRequestSuccess,
    finishCallRequestSuccess,
    finishCallRequest
}) => {
    // Check no call EFFECT
    useEffect(() => {
        if (!call) {
            history.push('/home');
        }
    }, [call]);

    // Check no callRequest EFFECT
    useEffect(() => {
        if (!callRequest) {
            history.push('/home');
        }
    }, [callRequest]);

    // Check State EFFECT
    useEffect(() => {
        console.log(
            '::: Call CHECK STATE EFFECT',
            callRequest
        );

        if (callRequest && callRequest.state === 'CANCELLED') {
            cancelCallRequestSuccess();
            toastr.info('Info', 'Su llamada ha sido cancelada.');
        }

        if (callRequest && callRequest.state === 'FINISHED') {
            finishCallRequestSuccess();
            toastr.info('Info', 'Su llamada ha sido finalizada.');
        }
    }, [callRequest]);

    const submitFinishCallRequest = () => {
        const { storeId, callRequestId } = callRequest;
        finishCallRequest(storeId, callRequestId);
    };

    return (
        <>
            <Row>
                <Col lg={12} md={12} xs={12}>
                    <OTSession
                        apiKey={call.tokboxApiKey}
                        token={call.tokboxTokenCallRequest}
                        sessionId={call.tokboxSessionId}
                    >
                        <div id="publisher"><OTPublisher /></div>
                        <OTStreams>
                            <div id="subscriber">
                                <OTSubscriber 
                                    properties={{ 
                                        insertMode: 'append',
                                        fitMode: true, 
                                        width: '100%', 
                                        height: '100%' 
                                    }}
                                />
                            </div>
                        </OTStreams>
                    </OTSession>
                </Col>
            </Row>
            <Navbar fixed="bottom">
                <Button
                    onClick={submitFinishCallRequest}
                >
                    Finalizar llamada
                </Button>
            </Navbar>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        callRequest: state.callRequest.callRequest,
        call: state.call.call,
    };
};

export default connect(
    mapStateToProps,
    {
        cancelCallRequestSuccess,
        finishCallRequestSuccess,
        finishCallRequest
    } //connect actions creators to the component
)(Call);
