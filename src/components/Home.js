import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import history from '../history';

const Home = ({ callRequest }) => {
    useEffect(() => {
        if (callRequest.callRequest) {
            history.push('/waiting-room');
        }
    }, [callRequest.callRequest]);
    return (
        <div>
            <h1>Home</h1>
        </div>
    );
};

const mapStateToProps = (state) => {
    return { callRequest: state.callRequest };
};

export default connect(
    mapStateToProps,
    {} //connect actions creators to the componen t
)(Home);
