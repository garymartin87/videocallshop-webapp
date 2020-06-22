import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import history from '../history';

import {
    fetchStores
} from '../actions/storeActions';

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
        let rows = stores.stores.map((store, index) => {
            return (
                <p key={store.storeId}><button href="#" onClick={() => goToCreateCallRequest(store.storeId)} >{store.name}</button></p>
            );
        });

        return rows;
    };

    return (
        <div>
            <h1>Home</h1>

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

        </div>
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
