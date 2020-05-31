import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const HasCallRoute = ({ component: Component, hasCall, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) =>
                hasCall === true ? (
                    <Component {...rest} {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: '/create-call-request',
                            state: { from: props.location },
                        }}
                    />
                )
            }
        />
    );
};

const mapStateToProps = (state, ownProps) => {
    return { hasCall: !!state.call.call };
};

export default connect(mapStateToProps, null)(HasCallRoute);
