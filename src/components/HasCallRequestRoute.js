import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const HasCallRequestRoute = ({
    component: Component,
    hasCallRequestToken,
    ...rest
}) => {
    return (
        <Route
            {...rest}
            render={(props) =>
                hasCallRequestToken === true ? (
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
    return { hasCallRequestToken: !!state.callRequest.callRequest };
};

export default connect(mapStateToProps, null)(HasCallRequestRoute);
