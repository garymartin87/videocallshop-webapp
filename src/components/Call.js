import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';

import history from '../history';

import {
    cancelCallRequestSuccess,
    finishCallRequestSuccess
} from '../actions/callRequestActions';

import { toastr } from 'react-redux-toastr';

// import history from '../history';

const Call = ({
    callRequest,
    call,
    cancelCallRequestSuccess,
    finishCallRequestSuccess
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

    // ToDo: Move apiKey
    return (
        <div>
            <OTSession
                apiKey={call.tokboxApiKey}
                token={call.tokboxTokenCallRequest}
                sessionId={call.tokboxSessionId}
            >
                <OTPublisher />
                <OTStreams>
                    <OTSubscriber />
                </OTStreams>
            </OTSession>
        </div>
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
    } //connect actions creators to the component
)(Call);
