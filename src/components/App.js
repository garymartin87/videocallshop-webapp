import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Router, Switch, Redirect } from 'react-router-dom';

import history from '../history';

import PrivateRoute from './PrivateRoute';
import CreateCallRequest from './CreateCallRequest';
import Call from './Call';

function App() {
    return (
        <div>
            <Router history={history}>
                <div className="path-wrap">
                    <Switch>
                        <Route
                            path="/create-call-request"
                            exact
                            component={CreateCallRequest}
                        />
                        <PrivateRoute path="/call" exact component={Call} />
                        <Redirect to="/create-call-request" />
                        {/* default state when not match found */}
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

export default App;
