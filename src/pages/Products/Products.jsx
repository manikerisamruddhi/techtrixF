import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Spin, Empty, Layout, Typography, Card, Row, Col, Modal, notification } from 'antd';
import {  deleteProduct, addProduct, updateProduct, fetchProducts } from '../../redux/slices/productSlice';
import ProductDetailModal from '../../components/Product/ProductDetails';
import ProductFormModal from '../../components/Product/AddProduct';

const { Content } = Layout;
const { Title } = Typography;

const Products = () => {
    const dispatch = useDispatch();
    const { items: products, loading, error } = useSelector((state) => state.products);

    const [isDetailModalVisible, setDetailModalVisible] = useState(false);
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Fetch products on mount
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        setFilteredProducts(products); // Initially, show all products
    }, [products]);

    const handleDelete = (productId) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this product?',
            onOk: () => {
                dispatch(deleteProduct(productId));
                
            },
        });
    };

    const handleCreateProduct = (values) => {
        dispatch(addProduct(values));
        setCreateModalVisible(false);
        notification.success({
            message: 'Success',
            description: 'Product created successfully!',
        });
    };

    const handleEditProduct = (values) => {
        dispatch(updateProduct({ ...selectedProduct, ...values }))
            .then(() => {
                notification.success({
                    message: 'Success',
                    description: 'Product updated successfully!',
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

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setDetailModalVisible(true);
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
            title: 'Description',
            dataIndex: 'description',
            key: 'category',
            width: 400,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <span>
                    <Button type="primary" onClick={() => handleViewDetails(record)}>View</Button>
                    <Button type="link" onClick={() => handleOpenEditModal(record)}>Edit</Button>
                    <Button danger onClick={() => handleDelete(record.productId)}>Delete</Button>
                </span>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh', background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)' }}>
            <Content style={{ padding: '20px' }}>
                <div className="content-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <Title level={4} style={{ margin: 0 }}>Product List</Title>
                        <Button onClick={() => setCreateModalVisible(true)} type="primary">
                            Create Product
                        </Button>
                    </div>



                    {/* Products Table */}
                    {loading ? (
                        <Spin tip="Loading..." />
                    ) : filteredProducts.length === 0 ? (
                        <Empty description="No Products Available" />
                    ) : (
                        <Table
                            dataSource={filteredProducts}
                            columns={columns}
                            rowKey="id"
                            pagination={false}
                        />
                    )}

                    {/* Product Details Modal */}
                    {selectedProduct && (
                        <ProductDetailModal
                            visible={isDetailModalVisible}
                            product={selectedProduct}
                            onClose={() => setDetailModalVisible(false)}
                        />
                    )}

                    {/* Create Product Modal */}
                    <ProductFormModal
    visible={isCreateModalVisible}
    onCancel={() => setCreateModalVisible(false)}
    onCreate={handleCreateProduct}
/>

                    {/* Edit Product Modal
                    {isEditModalVisible && (
                        <EditModal
                            visible={isEditModalVisible}
                            product={selectedProduct}
                            onCancel={() => setEditModalVisible(false)}
                            onSave={handleEditProduct}
                        />
                    )} */}
                    
                    {/* Edit Product Modal */}
                    <ProductFormModal
                        visible={isEditModalVisible}
                        onCancel={() => setEditModalVisible(false)}
                        // onCreate={handleEditProduct}
                        product={selectedProduct}
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default Products;
