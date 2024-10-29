import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotationDetails, updateQuotation } from '../../redux/slices/quotationSlice';
import { fetchProducts } from '../../redux/slices/productSlice';
import { useParams, useHistory } from 'react-router-dom';

const EditQuotation = () => {
    const { quotationId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const { quotation } = useSelector((state) => state.quotations);
    const { products } = useSelector((state) => state.products);
    const [formData, setFormData] = useState({
        products: [],
        discount: 0,
        comments: '',
    });

    useEffect(() => {
        dispatch(fetchQuotationDetails(quotationId));
        dispatch(fetchProducts());
    }, [dispatch, quotationId]);

    useEffect(() => {
        if (quotation) {
            setFormData({
                products: quotation.products,
                discount: quotation.discount,
                comments: quotation.comments,
            });
        }
    }, [quotation]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateQuotation({ id: quotationId, ...formData }));
        history.push('/quotations');
    };

    return (
        <div className="edit-quotation-container">
            <h1>Edit Quotation</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <h2>Edit Products</h2>
                    {products.map((product) => (
                        <div key={product.productId}>
                            <label>{product.name}</label>
                            <input
                                type="number"
                                placeholder="Quantity"
                                defaultValue={formData.products.find((p) => p.id === product.productId)?.quantity || 0}
                                onChange={(e) => {
                                    const updatedProducts = formData.products.map((p) =>
                                        p.id === product.productId ? { ...p, quantity: e.target.value } : p
                                    );
                                    setFormData({ ...formData, products: updatedProducts });
                                }}
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
                <button type="submit">Update Quotation</button>
            </form>
        </div>
    );
};

export default EditQuotation;
