import React, { useEffect } from 'react';

import '../styles/styles.scss';
import { Navbar } from 'react-bootstrap';

import { Route, Router, Switch, Redirect } from 'react-router-dom';
import ReduxToastr from 'react-redux-toastr'
import { connect } from 'react-redux';

import history from '../history';
import { storePollingInterval } from '../actions/callRequestActions';
import HasCallRequestRoute from './HasCallRequestRoute';
import HasCallRoute from './HasCallRoute';
import CreateCallRequest from './CreateCallRequest';
import Call from './Call';
import WaitingRoom from './WaitingRoom';
import Home from './Home';

import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';

function App({ callRequest, storePollingInterval }) {
    useEffect(() => {        
        if(callRequest.callRequest && !callRequest.pollingInterval) {
            storePollingInterval();
        }
    }, []);

    return (
        <>
        {/*  <Navbar bg="primary" sticky="top">
                <Navbar.Brand>VIDEO CALL SHOP</Navbar.Brand>
            </Navbar> */}
        
            <Router history={history}>
                <Switch>
                    <Route
                        path="/:storeId/create-call-request"
                        exact
                        component={CreateCallRequest}
                    />
                    <Route path="/home" exact component={Home} />
                    <HasCallRequestRoute
                        path="/waiting-room"
                        exact
                        component={WaitingRoom}
                    />
                    <HasCallRoute path="/call" exact component={Call} />
                    {/* default state when not match found */}
                    <Redirect to="/home" />
                </Switch>
            </Router>
            <ReduxToastr
                timeOut={4000}
                newestOnTop={false}
                preventDuplicates
                position="top-right"
                transitionIn="fadeIn"
                transitionOut="fadeOut"
                progressBar
                closeOnToastrClick
                confirmOptions={{
                    okText: 'aceptar',
                    cancelText: 'cancelar',
                }}
            /> 
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        callRequest: state.callRequest,
    };
};

export default connect(
    mapStateToProps,
    {
        storePollingInterval
    } //connect actions creators to the component
)(App);
