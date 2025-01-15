import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Spin, Empty, Layout, Typography, Input, Modal, notification } from 'antd';
import { deleteProduct, updateProduct, fetchNonCustProducts } from '../../redux/slices/productSlice';
import ProductDetailModal from '../../components/Product/ProductDetails';
import ProductFormModal from '../../components/Product/AddProduct';

const { Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const Products = () => {
    const dispatch = useDispatch();
    const { nonCustomerProducts: products, loading } = useSelector((state) => state.products);

    const [isDetailModalVisible, setDetailModalVisible] = useState(false);
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));

    // Fetch products on mount
    useEffect(() => {
        if(!products || products.length === 0) {
            dispatch(fetchNonCustProducts());
        }
    }, [dispatch]);

    useEffect(() => {
        setFilteredProducts(products);
    }, [products]);

    const refresh = () => {
        dispatch(fetchNonCustProducts());
    };

    const handleDelete = (productId) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this product?',
            onOk: () => {
                dispatch(deleteProduct(productId));
            },
        });
    };

    const handleCreateProduct = () => {
        dispatch(fetchNonCustProducts());
        setCreateModalVisible(false);
        notification.success({
            message: 'Success',
            description: 'Product added successfully!',
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

    const handleSearch = (value) => {
        setSearchValue(value);
        if (value.trim() === '') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter((product) => {
                const brand = product.brand ? product.brand.toLowerCase() : '';
                const modelNo = product.modelNo ? product.modelNo.toLowerCase() : '';
                const description = product.description ? product.description.toLowerCase() : '';
                return (
                    brand.includes(value.toLowerCase()) ||
                    modelNo.includes(value.toLowerCase()) ||
                    description.includes(value.toLowerCase())
                );
            });
            setFilteredProducts(filtered);
        }
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
            key: 'description', // Corrected key
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
                <span key={record.productId}> {/* Added key prop */}
                    <Button type="primary" onClick={() => handleViewDetails(record)}>View</Button>
                    <Button type="link" onClick={() => handleOpenEditModal(record)}>Edit</Button>
                    {user && user.role === 'Admin' && (
                        <Button danger onClick={() => handleDelete(record.productId)}>Delete</Button>
                    )}
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
                    <Search
                        placeholder="Search products by brand, model, or description"
                        allowClear
                        enterButton="Search"
                        size="large"
                        value={searchValue}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ marginBottom: '20px' }}
                    />

                    {/* Products Table */}
                    {loading ? (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <Spin tip="Loading...">
      <div style={{ minHeight: '50px' }} />
    </Spin>
  </div>
) : filteredProducts.length === 0 ? (
  <Empty description="No Products Available" />
) : (
  <Table
    dataSource={filteredProducts}
    columns={columns}
    rowKey="id"
    pagination={{
      pageSize: 10, // Number of items per page
      showSizeChanger: false, // Disable size changer
    }}
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
                        onAddProduct={handleCreateProduct}
                       
                    />

                    {/* Edit Product Modal */}
                    <ProductFormModal
                        visible={isEditModalVisible}
                        onCancel={() => setEditModalVisible(false)}
                        product={selectedProduct}
                        refresh={refresh}
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default Products;
