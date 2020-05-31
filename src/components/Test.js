import React from 'react';
import { connect } from 'react-redux';

const Test = ({ apiKey, token, sessionId }) => {
    return (
        <div>
            <h1>Test</h1>
            <p>{apiKey}</p>
            <p>{token}</p>
            <p>{sessionId}</p>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {};
};

export default connect(
    mapStateToProps,
    {} //connect actions creators to the componen t
)(Test);
