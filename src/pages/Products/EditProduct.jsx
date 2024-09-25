import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, updateProduct } from '../../redux/slices/productSlice';
import { useParams, useHistory } from 'react-router-dom';

const EditProduct = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const { product, loading, error } = useSelector((state) => state.products);
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

    useEffect(() => {
        if (productId) {
            dispatch(fetchProductDetails(productId));
        }
    }, [dispatch, productId]);

    useEffect(() => {
        if (product) {
            setFormData({
                brand: product.brand,
                modelNo: product.modelNo,
                partCode: product.partCode,
                description: product.description,
                price: product.price,
                quantity: product.quantity,
                warrantyMonths: product.warrantyMonths,
                isNegotiable: product.isNegotiable,
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateProduct({ id: productId, ...formData }));
        history.push('/products');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading product</div>;

    return (
        <div className="edit-product-container">
            <h1>Edit Product</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Brand</label>
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
                <button type="submit">Update Product</button>
            </form>
        </div>
    );
};

export default EditProduct;
