import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Router, Switch, Redirect } from 'react-router-dom';
import ReduxToastr from 'react-redux-toastr';

import history from '../history';

import PrivateRoute from './PrivateRoute';
import CreateCallRequest from './CreateCallRequest';
import Call from './Call';
import WaitingRoom from './WaitingRoom';

import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';

function App() {
    return (
        <div className="container">
            <Router history={history}>
                <Switch>
                    <Route
                        path="/create-call-request"
                        exact
                        component={CreateCallRequest}
                    />
                    <PrivateRoute
                        path="/waiting-room"
                        exact
                        component={WaitingRoom}
                    />
                    <PrivateRoute path="/call" exact component={Call} />
                    {/* default state when not match found */}
                    <Redirect to="/create-call-request" />
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
        </div>
    );
}

export default App;
