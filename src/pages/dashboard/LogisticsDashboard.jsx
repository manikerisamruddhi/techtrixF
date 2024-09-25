import React from 'react';
import { useSelector } from 'react-redux';
import ShipmentList from '../../components/Shipments/ShipmentList';
import ProductList from '../../components/Products/ProductList';

const LogisticsDashboard = () => {
    const shipments = useSelector((state) => state.shipments.allShipments);
    const products = useSelector((state) => state.products.allProducts);

    return (
        <div className="dashboard-container">
            <h1>Logistics Dashboard</h1>
            <section>
                <h2>Shipments</h2>
                <ShipmentList shipments={shipments} />
            </section>
            <section>
                <h2>Products</h2>
                <ProductList products={products} />
            </section>
        </div>
    );
};

export default LogisticsDashboard;
