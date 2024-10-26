import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers } from '../../redux/slices/customerSlice';
import { fetchQuotations } from '../../redux/slices/quotationSlice';
// import { createInvoice } from '../../redux/slices/invoiceSlice';
import { useNavigate } from 'react-router-dom'; // Change here ash

const CreateInvoice = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Change here
    const { customers } = useSelector((state) => state.customers);
    const { quotations } = useSelector((state) => state.quotations);
    const [formData, setFormData] = useState({
        customerId: '',
        quotationId: '',
        invoiceDate: '',
        dueDate: '',
        products: [],
        notes: '',
    });

    useEffect(() => {
        dispatch(fetchCustomers());
        dispatch(fetchQuotations());
    }, [dispatch]);

    const handleProductChange = (productId, quantity) => {
        const quotation = quotations.find((q) => q.id === formData.quotationId);
        const product = quotation?.products.find((prod) => prod.id === productId);
        const productData = {
            id: productId,
            quantity,
            unitPrice: product?.unitPrice || 0,
            totalPrice: quantity * (product?.unitPrice || 0),
        };
        setFormData((prevData) => ({
            ...prevData,
            products: [...prevData.products, productData],
        }));
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     dispatch(createInvoice(formData)); // Dispatch the action to create invoice
    //     navigate('/invoices'); // Change here
    // };

    return (
        <div className="create-invoice-container">
            <h1>Create New Invoice</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Customer</label>
                    <select
                        name="customerId"
                        value={formData.customerId}
                        onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                        required
                    >
                        <option value="">Select Customer</option>
                        {customers.map((customer) => (
                            <option key={customer.customerId} value={customer.customerId}>
                                {customer.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Quotation</label>
                    <select
                        name="quotationId"
                        value={formData.quotationId}
                        onChange={(e) => setFormData({ ...formData, quotationId: e.target.value })}
                        required
                    >
                        <option value="">Select Quotation</option>
                        {quotations.map((quotation) => (
                            <option key={quotation.id} value={quotation.id}>
                                Quotation #{quotation.id}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Invoice Date</label>
                    <input
                        type="date"
                        name="invoiceDate"
                        value={formData.invoiceDate}
                        onChange={(e) => setFormData({ ...prevData, invoiceDate: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Due Date</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                </div>
                <div>
                    <h2>Add Products</h2>
                    {quotations
                        .find((q) => q.id === formData.quotationId)
                        ?.products.map((product) => (
                            <div key={product.id}>
                                <label>{product.name}</label>
                                <input
                                    type="number"
                                    placeholder="Quantity"
                                    onChange={(e) => handleProductChange(product.id, e.target.value)}
                                />
                            </div>
                        ))}
                </div>
                <div>
                    <label>Notes</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                </div>
                <button type="submit">Create Invoice</button>
            </form>
        </div>
    );
};

export default CreateInvoice;
