import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, addProduct, updateProduct } from '../../redux/slices/productSlice';
import { Table, Button, Typography, Modal, notification } from 'antd';
import ProductDetailModal from './ProductDetails2';
import ProductFormModal from './AddProduct';
import EditModal from './EditProduct'; // Import EditModal

const { Title } = Typography;

const Products = () => {
    const dispatch = useDispatch();
    const { items: products, loading, error } = useSelector((state) => state.products);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDetailModalVisible, setDetailModalVisible] = useState(false);
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleDelete = (productId) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this product?',
            onOk: () => {
                dispatch(deleteProduct(productId));
            },
        });
    };

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setDetailModalVisible(true);
    };

    const handleCreateProduct = (values) => {
        dispatch(addProduct(values));
        setCreateModalVisible(false);
    };

    const handleEditProduct = (values) => {
        dispatch(updateProduct({ ...selectedProduct, ...values })) // Merge updated values with the selected product
            .then(() => {
                notification.success({
                    message: 'Success',
                    description: 'Product updated successfully!', // Show success notification
                });
            })
            .catch((error) => {
                notification.error({
                    message: 'Error',
                    description: error.message || 'Failed to update product',
                });
            });
        setEditModalVisible(false);
        setSelectedProduct(null);
    };

    const handleOpenEditModal = (product) => {
        setSelectedProduct(product);
        setEditModalVisible(true);
    };

    const columns = [
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
        },
        {
            title: 'Model No',
            dataIndex: 'model_no', // Ensure this matches your data
            key: 'modelNo',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <span>
                    <Button type="link" onClick={() => handleViewDetails(record)}>View</Button>
                    <Button type="link" onClick={() => handleOpenEditModal(record)}>Edit</Button>
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
            {/* <Button type="primary" className="create-product-btn" onClick={() => setCreateModalVisible(true)}>
                Create Product
            </Button> */}
            <Table
                dataSource={products}
                columns={columns}
                rowKey="id"
                pagination={false}
            />
            {products.length === 0 && <div>No products found.</div>}
            {selectedProduct && (
                <ProductDetailModal
                    visible={isDetailModalVisible}
                    product={selectedProduct}
                    onClose={() => setDetailModalVisible(false)}
                />
            )}
            <ProductFormModal
                visible={isCreateModalVisible}
                onCancel={() => setCreateModalVisible(false)}
                onCreate={handleCreateProduct}
            />
            {isEditModalVisible && (
                <EditModal
                    visible={isEditModalVisible}
                    product={selectedProduct} // Pass selected product for editing
                    onCancel={() => setEditModalVisible(false)}
                    onSave={handleEditProduct}
                />
            )}
        </div>
    );
};

export default Products;
