import React from 'react';
import { connect } from 'react-redux';

const WaitingRoom = () => {
    return (
        <div>
            <h1>WaitingRoom</h1>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {};
};

export default connect(
    mapStateToProps,
    {} //connect actions creators to the componen t
)(WaitingRoom);
