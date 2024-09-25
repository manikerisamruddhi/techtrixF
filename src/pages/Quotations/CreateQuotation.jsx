import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets } from '../../redux/slices/ticketSlice';
import { fetchProducts } from '../../redux/slices/productSlice';
import { createQuotation } from '../../redux/slices/quotationSlice';
import { useHistory } from 'react-router-dom';

const CreateQuotation = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { tickets } = useSelector((state) => state.tickets);
    const { products } = useSelector((state) => state.products);
    const [formData, setFormData] = useState({
        ticketId: '',
        products: [],
        totalAmount: 0,
        discount: 0,
        comments: '',
    });

    useEffect(() => {
        dispatch(fetchTickets());
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleProductChange = (productId, quantity) => {
        const product = products.find((prod) => prod.id === productId);
        const productData = {
            id: productId,
            quantity: quantity,
            unitPrice: product.price,
            totalPrice: quantity * product.price,
        };
        setFormData((prevData) => ({
            ...prevData,
            products: [...prevData.products, productData],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createQuotation(formData));
        history.push('/quotations');
    };

    return (
        <div className="create-quotation-container">
            <h1>Create New Quotation</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Ticket</label>
                    <select
                        name="ticketId"
                        value={formData.ticketId}
                        onChange={(e) => setFormData({ ...formData, ticketId: e.target.value })}
                        required
                    >
                        <option value="">Select Ticket</option>
                        {tickets.map((ticket) => (
                            <option key={ticket.id} value={ticket.id}>
                                Ticket #{ticket.id}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <h2>Add Products</h2>
                    {products.map((product) => (
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
                    <label>Discount</label>
                    <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    />
                </div>
                <div>
                    <label>Comments</label>
                    <textarea
                        name="comments"
                        value={formData.comments}
                        onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    />
                </div>
                <button type="submit">Create Quotation</button>
            </form>
        </div>
    );
};

export default CreateQuotation;
