import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoiceDetails } from '../../redux/slices/invoiceSlice';
import { useParams } from 'react-router-dom';

const InvoiceDetails = () => {
    const { invoiceId } = useParams();
    const dispatch = useDispatch();
    const { invoice, loading, error } = useSelector((state) => state.invoices);

    useEffect(() => {
        dispatch(fetchInvoiceDetails(invoiceId));
    }, [dispatch, invoiceId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading invoice details</div>;

    return (
        <div className="invoice-details-container">
            <h1>Invoice Details</h1>
            <p>Invoice Number: {invoice.invoiceNumber}</p>
            <p>Status: {invoice.paymentStatus}</p>
            <p>Customer: {invoice.customerName}</p>
            <p>Invoice Date: {invoice.invoiceDate}</p>
            <p>Total Amount: {invoice.totalAmount}</p>
            <p>Final Amount: {invoice.finalAmount}</p>
            <h2>Products:</h2>
            <ul>
                {invoice.products.map((product) => (
                    <li key={product.id}>
                        {product.name} - {product.quantity} x {product.unitPrice} = {product.totalPrice}
                    </li>
                ))}
            </ul>
            <p>Notes: {invoice.notes}</p>
        </div>
    );
};

export default InvoiceDetails;
