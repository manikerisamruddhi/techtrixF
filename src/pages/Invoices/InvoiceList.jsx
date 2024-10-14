import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoices } from '../../redux/slices/invoiceSlice';
import { Link } from 'react-router-dom';

const InvoiceList = () => {
    const dispatch = useDispatch();
    const { invoices, loading, error } = useSelector((state) => state.invoices);

    useEffect(() => {
        dispatch(fetchInvoices());
    }, [dispatch]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading invoices</div>;

    return (
        <div className="invoice-list-container">
            <h1>Invoice List</h1>
            <Link to="/create-invoice" className="create-invoice-btn">Create Invoice</Link>
            <ul>
                {invoices.map(invoice => (
                    <li key={invoice.id}>
                        <Link to={`/invoice/${invoice.id}`}>
                            Invoice #{invoice.invoiceNumber} - {invoice.paymentstatus}
                        </Link>
                        <Link to={`/edit-invoice/${invoice.id}`}>Edit</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InvoiceList;
