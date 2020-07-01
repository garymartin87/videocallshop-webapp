import React from 'react';

import { Row, Col, Image } from 'react-bootstrap';

const StoreHeader = ({ store }) => {
    return (
        <Row>
            <Col lg={{span: 4, offset: 4}} md={{span: 6, offset: 3}} xs={{span: 12, offset: 0}}>
                {
                    !store && <p>Cargando información de la tienda</p>
                }

                {
                    store && <div class="text-center">
                        <Row><Col lg={12} md={12} xs={12}><Image src={store.logoImageXxxhdpiUrl} style={{ width: '50px' }}></Image></Col></Row>
                        <Row><Col lg={12} md={12} xs={12}><h2>{store.name}</h2></Col></Row>
                        <hr/>
                    </div>
                }
            </Col>
        </Row>
        
    );
};

export default StoreHeader;
