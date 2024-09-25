import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoiceDetails, updateInvoice } from '../../redux/slices/invoiceSlice';
import { fetchProducts } from '../../redux/slices/productSlice';
import { useParams, useHistory } from 'react-router-dom';

const EditInvoice = () => {
    const { invoiceId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const { invoice } = useSelector((state) => state.invoices);
    const { products } = useSelector((state) => state.products);
    const [formData, setFormData] = useState({
        products: [],
        discount: 0,
        notes: '',
    });

    useEffect(() => {
        dispatch(fetchInvoiceDetails(invoiceId));
        dispatch(fetchProducts());
    }, [dispatch, invoiceId]);

    useEffect(() => {
        if (invoice) {
            setFormData({
                products: invoice.products,
                discount: invoice.discount,
                notes: invoice.notes,
            });
        }
    }, [invoice]);

    const handleProductChange = (productId, quantity) => {
        const updatedProducts = formData.products.map((product) =>
            product.id === productId ? { ...product, quantity } : product
        );
        setFormData({ ...formData, products: updatedProducts });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateInvoice({ ...formData, id: invoiceId }));
        history.push(`/invoice/${invoiceId}`);
    };

    return (
        <div className="edit-invoice-container">
            <h1>Edit Invoice</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <h2>Edit Products</h2>
                    {products.map((product) => (
                        <div key={product.id}>
                            <label>{product.name}</label>
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={formData.products.find((p) => p.id === product.id)?.quantity || ''}
                                onChange={(e) => handleProductChange(product.id, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
                <div>
                    <label>Discount</label>
                    <input
                        type="number"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    />
                </div>
                <div>
                    <label>Notes</label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                </div>
                <button type="submit">Update Invoice</button>
            </form>
        </div>
    );
};

export default EditInvoice;
