import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../../redux/slices/productSlice';
import { Link } from 'react-router-dom';

const ProductList = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleDelete = (productId) => {
        dispatch(deleteProduct(productId));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading products</div>;

    return (
        <div className="product-list-container">
            <h1>Product List</h1>
            <Link to="/create-product" className="create-product-btn">Create Product</Link>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        <Link to={`/product/${product.id}`}>
                            {product.brand} - {product.modelNo}
                        </Link>
                        <button onClick={() => handleDelete(product.id)}>Delete</button>
                        <Link to={`/edit-product/${product.id}`}>Edit</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
