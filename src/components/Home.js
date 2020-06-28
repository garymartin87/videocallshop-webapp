import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Card } from 'react-bootstrap';
import { FaVideo } from 'react-icons/fa';

import history from '../history';

import { fetchStores } from '../actions/storeActions';

const Home = ({ callRequest, fetchStores, stores }) => {
    useEffect(() => {
        if (callRequest.callRequest) {
            history.push('/waiting-room');
            return ;
        }
    }, [callRequest.callRequest]);

    useEffect(() => {
        console.log("::: useEffect");
        fetchStores();
    }, [])

    const goToCreateCallRequest = storeId => {
        history.push(`/${storeId}/create-call-request`);
    };

    const renderStores = () => {
        let rows = Object.values(stores.stores).map((store, index) => {
            return (
                <Card key={store.storeId} style={{ marginBottom: '15px' }}>
                    <Card.Body>
                        <Row>
                            <Col md={3} xs={3}>
                                <Card.Img 
                                    src={ store.logoImageXxxhdpiUrl } 
                                    className='float-left'
                                    style={{ width: '50px' }}
                                ></Card.Img>
                            </Col>

                            <Col md={6} xs={6}>
                                <h2>{store.name}</h2>
                            </Col>

                            <Col md={3} xs={3}>
                                <Button 
                                    size="lg" 
                                    href="#" 
                                    className="float-right" 
                                    onClick={() => goToCreateCallRequest(store.storeId)}
                                >
                                    <FaVideo />
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            );
        });

        return rows;
    };

    return (
        <Row>
            <Col md={{ span: 6, offset: 3 }} xs={{ span: 12, offset: 0 }}>
                <h4>Seleccione una tienda a llamar</h4>

                {stores.isFetching && (
                    <>
                        <p>Cargando tiendas</p>
                    </>
                )}

                {!stores.isFetching && (
                    <>
                        {renderStores()}
                    </>
                )}
            </Col>
        </Row>
    );
};

const mapStateToProps = (state) => {
    return { 
        callRequest: state.callRequest,
        stores: state.stores
    };
};

export default connect(
    mapStateToProps,
    { fetchStores } //connect actions creators to the component
)(Home);
