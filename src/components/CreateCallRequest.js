import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';

import { createCallRequest } from '../actions/callRequestActions';
import history from '../history';

const CreateCallRequest = ({ createCallRequest, callRequest, match }) => {
    const { register, handleSubmit, errors } = useForm();
    const onSubmit = (data) => {
        const { email, name, lastName } = data;
        const storeId = match.params.storeId;
        createCallRequest(storeId, email, name, lastName);
    };

    useEffect(() => {
        if (callRequest.callRequest) {
            history.push('/waiting-room');
        }
    }, [callRequest.callRequest]);

    return (
        <div className="row">
            <div className="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-xs-12">
                <form
                    id="create-call-request-form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            ref={register({ required: true })}
                        />
                        {errors.email && <span>This field is required</span>}
                    </div>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input
                            name="name"
                            type="text"
                            className="form-control"
                            ref={register({ required: true })}
                        />
                        {errors.name && <span>This field is required</span>}
                    </div>
                    <div className="form-group">
                        <label>Apellido</label>
                        <input
                            name="lastName"
                            type="text"
                            className="form-control"
                            ref={register({ required: true })}
                        />
                        {errors.lastName && <span>This field is required</span>}
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Ingresar a sala de espera
                    </button>
                </form>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        callRequest: state.callRequest,
    };
};

export default connect(
    mapStateToProps,
    { createCallRequest } //connect actions creators to the component
)(CreateCallRequest);
