import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Row, Col, Container } from 'react-bootstrap';

import { createCallRequest } from '../actions/callRequestActions';
import StoreHeader from './StoreHeader';
import { fetchStores } from '../actions/storeActions';
import history from '../history';

const CreateCallRequest = ({ createCallRequest, callRequest, fetchStores, store, match }) => {
    const { register, handleSubmit, errors } = useForm();
    const onSubmit = (data) => {
        const { email, name, lastName } = data;
        const storeId = match.params.storeId;
        createCallRequest(storeId, email, name, lastName);
    };

    useEffect(() => {
        if(!store) {
            fetchStores();
        }
    }, []);

    useEffect(() => {
        if (callRequest.callRequest) {
            history.push('/waiting-room');
        }
    }, [callRequest.callRequest]);

    return (
        <Container style={{ marginTop: '20px' }}>
            <StoreHeader store={store} />  
            <Row style={{ marginTop: '20px' }}>
                <Col lg={{span: 4, offset: 4}} md={{span: 6, offset: 3}} xs={{span: 12, offset: 0}}>
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
                </Col>
            </Row>
        </Container>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        callRequest: state.callRequest,
        store: state.stores.stores[ownProps.match.params.storeId]
    };
};

export default connect(
    mapStateToProps,
    { createCallRequest, fetchStores } //connect actions creators to the component
)(CreateCallRequest);
