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

   const [pulling, setPulling] = useState(null);

    const destroyPulling = () => {
        console.log('::: WaitingRoom destroyPulling PULLING STOP');
        clearInterval(pulling);
        setPulling(null);
    }

    // Pulling EFFECT
    useEffect(() => {
        console.log('::: WaitingRoom PULLING START');
        if(!pulling) {
            setPulling(setInterval(refreshCallRequestState, 5000));
        }

        return () => { 
            destroyPulling();
        }
    }, []);

    // Check State EFFECT
    useEffect(() => {
        console.log(
            '::: Call CHECK STATE EFFECT',
            callRequest.state
        );

        if (callRequest.state === 'CANCELLED') {
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
            token={call.tokboxTokenCallRequest}
            sessionId={call.tokboxSessionId}
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
        callRequest: state.callRequest.callRequest,
        call: state.call.call,
    };
};

export default connect(
    mapStateToProps,
    {
        refreshCallRequestState,
        cancelCallRequestSuccess,
    } //connect actions creators to the component
)(Call);
