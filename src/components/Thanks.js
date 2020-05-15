import React from 'react';
import { connect } from 'react-redux';

const Thanks = () => {
    return (
        <div>
            <h1>Thanks</h1>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {};
};

export default connect(
    mapStateToProps,
    {} //connect actions creators to the componen t
)(Thanks);
