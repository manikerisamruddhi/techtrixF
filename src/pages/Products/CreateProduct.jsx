import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProduct } from '../../redux/slices/productSlice';
import { useHistory } from 'react-router-dom';

const CreateProduct = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [formData, setFormData] = useState({
        brand: '',
        modelNo: '',
        partCode: '',
        description: '',
        price: 0,
        quantity: 1,
        warrantyMonths: 12,
        isNegotiable: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createProduct(formData));
        history.push('/products');
    };

    return (
        <div className="create-product-container">
            <h1>Create New Product</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Brankkkkjkjd</label>
                    <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Model Number</label>
                    <input
                        type="text"
                        name="modelNo"
                        value={formData.modelNo}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Part Code</label>
                    <input
                        type="text"
                        name="partCode"
                        value={formData.partCode}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Warranty (Months)</label>
                    <input
                        type="number"
                        name="warrantyMonths"
                        value={formData.warrantyMonths}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>
                        Is Negotiable
                        <input
                            type="checkbox"
                            name="isNegotiable"
                            checked={formData.isNegotiable}
                            onChange={(e) => setFormData({ ...formData, isNegotiable: e.target.checked })}
                        />
                    </label>
                </div>
                <button type="submit">Create Product</button>
            </form>
        </div>
    );
};

export default CreateProduct;
