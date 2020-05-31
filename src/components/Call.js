import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';

import {
    refreshCallRequestState,
    cancelCallRequestSuccess,
} from '../actions/callRequestActions';
import { toastr } from 'react-redux-toastr';
import Test from './Test';

// import history from '../history';

const Call = ({
    callRequest,
    call,
    refreshCallRequestState,
    cancelCallRequestSuccess,
}) => {
    console.log('::: Call', call);
    /*
    const [tokboxProps, setTokboxProps] = useState({
        apiKey: '46356842',
        sessionId: call.call.tokboxSessionId,
        token: call.call.tokboxTokenCallRequest,
    });
    */

    // Pulling EFFECT
    useEffect(() => {
        console.log('::: WaitingRoom pulling EFFECT');
        const pulling = setInterval(refreshCallRequestState, 5000);
        return () => clearInterval(pulling);
    }, []);

    // Check State EFFECT
    useEffect(() => {
        console.log(
            '::: WaitingRoom CHECK STATE EFFECT',
            callRequest.callRequest.state
        );

        if (callRequest.callRequest.state === 'CANCELLED') {
            cancelCallRequestSuccess();
            toastr.info('Info', 'Su llamada ha sido cancelada.');
        }
    }, [callRequest]);

    /*
    return (
        <Test
            apiKey={'46356842'}
            token={call.call.tokboxSessionId}
            sessionId={call.call.tokboxTokenCallRequest}
        />
    );
    */

    return (
        <OTSession
            apiKey={'46356842'}
            token={call.call.tokboxTokenCallRequest}
            sessionId={call.call.tokboxSessionId}
        >
            <OTPublisher />
            <OTStreams>
                <OTSubscriber />
            </OTStreams>
        </OTSession>
    );
};

const mapStateToProps = (state) => {
    return {
        callRequest: state.callRequest,
        call: state.call,
    };
};

export default connect(
    mapStateToProps,
    {
        refreshCallRequestState,
        cancelCallRequestSuccess,
    } //connect actions creators to the component
)(Call);
