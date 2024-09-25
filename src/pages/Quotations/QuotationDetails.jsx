import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotationDetails } from '../../redux/slices/quotationSlice';
import { useParams } from 'react-router-dom';

const QuotationDetails = () => {
    const { quotationId } = useParams();
    const dispatch = useDispatch();
    const { quotation, loading, error } = useSelector((state) => state.quotations);

    useEffect(() => {
        dispatch(fetchQuotationDetails(quotationId));
    }, [dispatch, quotationId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading quotation details</div>;

    return (
        <div className="quotation-details-container">
            <h1>Quotation Details</h1>
            <p>Quotation ID: {quotation.id}</p>
            <p>Status: {quotation.status}</p>
            <p>Created By: {quotation.createdBy}</p>
            <p>Quotation Date: {quotation.quotationDate}</p>
            <p>Total Amount: {quotation.totalAmount}</p>
            <p>Final Amount: {quotation.finalAmount}</p>
            <h2>Products:</h2>
            <ul>
                {quotation.products.map((product) => (
                    <li key={product.id}>
                        {product.name} - {product.quantity} x {product.unitPrice} = {product.totalPrice}
                    </li>
                ))}
            </ul>
            <p>Comments: {quotation.comments}</p>
        </div>
    );
};

export default QuotationDetails;
