import React from 'react';
import { connect } from 'react-redux';

const Call = () => {
    return (
        <div>
            <h1>Call</h1>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {};
};

export default connect(
    mapStateToProps,
    {} //connect actions creators to the componen t
)(Call);
