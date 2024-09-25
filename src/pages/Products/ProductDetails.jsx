import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails } from '../../redux/slices/productSlice';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProductDetails(productId));
    }, [dispatch, productId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading product details</div>;

    return (
        <div className="product-details-container">
            <h1>Product Details: {product.brand} - {product.modelNo}</h1>
            <p>Part Code: {product.partCode}</p>
            <p>Description: {product.description}</p>
            <p>Price: {product.price}</p>
            <p>Quantity: {product.quantity}</p>
            <p>Warranty: {product.warrantyMonths} months</p>
            <p>Warranty End Date: {product.warrantyEndDate}</p>
            <p>Is Negotiable: {product.isNegotiable ? 'Yes' : 'No'}</p>
        </div>
    );
};

export default ProductDetails;
