import React from 'react';

import { Col, Alert } from 'react-bootstrap';

const PurchaseOrder = ({ purchaseOrder }) => {
    const renderItems = items => {
        return (
            items.map((item, index) => {
                const { quantity, unitPrice, productName, productDescription } = item;
                let subtotal = unitPrice * quantity;
                return (
                    <li>{quantity} - {productName} (${unitPrice} c/u) - ${subtotal} {productDescription ? productDescription : null }</li>
                );
            })
        );
    };

    const getTotal = items => {
        let total = 0;
        let item;
        for(item of items) {
            const { quantity, unitPrice } = item;
            let subtotal = unitPrice * quantity;
            total += subtotal;
        }

        return total;
    };

    return (
        <Col lg={12} md={12} xs={12}>
            <Alert variant="info">
                <p style={{ marginBottom: '0px' }}><strong>Método de envío: </strong>{purchaseOrder.shippingOption.description}</p>
                <p style={{ marginBottom: '0px' }}><strong>Costo de envío: </strong>${purchaseOrder.shippingPrice}</p>
                <p style={{ marginBottom: '0px' }}><strong>Forma de pago: </strong>{purchaseOrder.paymentOption.description}</p>
                <p style={{ marginBottom: '0px' }}><strong>Provincia: </strong>{purchaseOrder.province}</p>
                <p style={{ marginBottom: '0px' }}><strong>Ciudad: </strong>{purchaseOrder.city}</p>
                <p style={{ marginBottom: '0px' }}><strong>Dirección: </strong>{purchaseOrder.address}</p>
                <p style={{ marginBottom: '0px' }}><strong>Items: </strong></p>
                <ul>
                    {renderItems(purchaseOrder.items)}
                </ul>
                <p style={{ marginBottom: '0px' }}><strong>TOTAL: ${getTotal(purchaseOrder.items)} ${purchaseOrder.shippingPrice ? ` + ${purchaseOrder.shippingPrice} (envío) = $${getTotal(purchaseOrder.items) + purchaseOrder.shippingPrice}` : ''}</strong></p>
            </Alert>
        </Col>
    );
};

export default PurchaseOrder;
