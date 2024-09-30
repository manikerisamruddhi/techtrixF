import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../../redux/slices/productSlice';
import { Link } from 'react-router-dom';
import { Table, Button, Typography } from 'antd';

const { Title } = Typography;

const ProductList = () => {
    const dispatch = useDispatch();
    const { items: products, loading, error } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleDelete = (productId) => {
        dispatch(deleteProduct(productId));
    };

    const columns = [
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
        },
        {
            title: 'Model No',
            dataIndex: 'modelNo',
            key: 'modelNo',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <span>
                    <Link to={`/product/${record.id}`}>
                        <Button type="link">View</Button>
                    </Link>
                    <Link to={`/edit-product/${record.id}`}>
                        <Button type="link">Edit</Button>
                    </Link>
                    <Button type="link" onClick={() => handleDelete(record.id)}>Delete</Button>
                </span>
            ),
        },
    ];

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading products</div>;

    return (
        <div className="product-list-container">
            <Title level={1}>Product List</Title>
            <Link to="/create-product">
                <Button type="primary" className="create-product-btn">Create Product</Button>
            </Link>
            <Table
                dataSource={products}
                columns={columns}
                rowKey="id"
                pagination={false}
            />
            {products.length === 0 && <div>No products found.</div>}
        </div>
    );
};

export default ProductList;
