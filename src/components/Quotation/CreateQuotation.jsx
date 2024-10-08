import React, { useEffect, useState } from 'react';
import { Modal, Form, Row, Col, Input, Button, Table, notification, Radio } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons'; 
import { useDispatch, useSelector } from 'react-redux'; 
import { fetchQuotations, addQuotation, resetError } from '../../redux/slices/quotationSlice';
import './QuotationForm.css'; 

const QuotationFormModal = ({ visible, onClose, ticketId }) => { 
    const dispatch = useDispatch();
    const { quotations, loading, error } = useSelector(state => state.quotations);
    
    const [form] = Form.useForm();
    const [newProduct, setNewProduct] = useState({
        brand: '',
        model_no: '',
        price: 0,
        quantity: 1,
        description: '',
        hasSerialNumber: 'no', 
    });
    const [showNewProductForm, setShowNewProductForm] = useState(false);
    const [addedProducts, setAddedProducts] = useState([]);
    const [editIndex, setEditIndex] = useState(null); // To track which product is being edited

    useEffect(() => {
        if (visible) {
            dispatch(fetchQuotations());
        }
    }, [dispatch, visible]);

    useEffect(() => {
        if (error) {
            notification.error({ message: error });
            dispatch(resetError()); // Reset error after showing
        }
    }, [error, dispatch]);

    const handleAddOrEditProduct = () => {
        // Validation Logic
        if (!newProduct.brand || !newProduct.model_no || newProduct.price <= 0 || newProduct.quantity <= 0) {
            notification.error({ message: 'Please fill in all product fields correctly!' });
            return;
        }

        if (editIndex !== null) {
            // Edit existing product
            const updatedProducts = addedProducts.map((product, index) => 
                index === editIndex ? { ...newProduct, key: product.key } : product
            );
            setAddedProducts(updatedProducts);
            notification.success({ message: 'Product updated successfully!' });
            setEditIndex(null); // Reset edit index
        } else {
            // Add new product
            const productWithKey = { ...newProduct, key: Date.now() };
            setAddedProducts(prev => [...prev, productWithKey]);
            notification.success({ message: 'Product added successfully!' });
        }

        // Reset form
        setNewProduct({ brand: '', model_no: '', price: 0, quantity: 1, description: '', hasSerialNumber: 'no' });
        setShowNewProductForm(false);
    };

    const handleEditProduct = (index) => {
        setNewProduct(addedProducts[index]);
        setEditIndex(index); // Set the index of the product being edited
        setShowNewProductForm(true); // Show the new product form for editing
    };

    const handleDeleteProduct = (index) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this product?',
            content: 'This action cannot be undone.',
            onOk: () => {
                const updatedProducts = addedProducts.filter((_, i) => i !== index);
                setAddedProducts(updatedProducts);
                notification.success({ message: 'Product deleted successfully!' });
            },
        });
    };

    const handleFinish = async () => {
        const quotationData = {
            ticketId,
            products: addedProducts,
            totalAmount: addedProducts.reduce((total, prod) => total + prod.price * prod.quantity, 0),
        };

        await dispatch(addQuotation(quotationData));
        notification.success({ message: 'Quotation added successfully!' });
        form.resetFields();
        setAddedProducts([]);
        onClose(); // Close modal after submission
    };

    return (
        <Modal
            title="Create Quotation"
            open={visible} // Use open instead of visible
            onCancel={onClose}
            footer={null}
            width={900}
            style={{ top: 20 }}
        >
            <div className="quotation-modal" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <Table
                    columns={[
                        { title: 'Brand', dataIndex: 'brand', key: 'brand' },
                        { title: 'Model No', dataIndex: 'model_no', key: 'model_no' },
                        { title: 'Price', dataIndex: 'price', key: 'price' },
                        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
                        { title: 'Serial Number?', dataIndex: 'hasSerialNumber', key: 'hasSerialNumber', render: text => (text === 'yes' ? 'Yes' : 'No') },
                        {
                            title: 'Actions',
                            key: 'actions',
                            render: (_, record, index) => (
                                <>
                                    <Button type="link" onClick={() => handleEditProduct(index)}>Edit</Button>
                                    <Button type="link" danger onClick={() => handleDeleteProduct(index)}>Delete</Button>
                                </>
                            ),
                        },
                    ]}
                    dataSource={addedProducts}
                    pagination={false}
                    bordered
                />
                <div style={{ textAlign: 'right', marginBottom: '15px' }}>
                    <Button type="primary" onClick={() => setShowNewProductForm(true)}>+ New Product</Button>
                </div>

                {showNewProductForm && (
                    <div className="product-form-border">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <h3>{editIndex !== null ? 'Edit Product' : 'Add Product'}</h3>
                            <Button type="text" icon={<CloseCircleOutlined />} onClick={() => setShowNewProductForm(false)} style={{ fontSize: '20px', color: 'red' }} />
                        </div>
                        <Form layout="vertical">
                            <Form.Item label="Description">
                                <Input.TextArea rows={2} value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                            </Form.Item>
                            <Form.Item label="Does this product have a serial number?">
                                <Radio.Group value={newProduct.hasSerialNumber} onChange={e => setNewProduct({ ...newProduct, hasSerialNumber: e.target.value })}>
                                    <Radio value="yes">Yes</Radio>
                                    <Radio value="no">No</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Brand">
                                        <Input value={newProduct.brand} onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Model No">
                                        <Input value={newProduct.model_no} onChange={e => setNewProduct({ ...newProduct, model_no: e.target.value })} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Quantity">
                                        <Input type="number" value={newProduct.quantity} onChange={e => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Price">
                                        <Input type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item>
                                <Button type="primary" onClick={handleAddOrEditProduct}>{editIndex !== null ? 'Update Product' : 'Add Product'}</Button>
                                <Button onClick={() => setShowNewProductForm(false)} style={{ marginLeft: 10 }}>Cancel</Button>
                            </Form.Item>
                        </Form>
                    </div>
                )}

                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item name="Comments" label="Comments">
                        <Input.TextArea placeholder="Add any comments" onChange={e => dispatch(setComments(e.target.value))} />
                    </Form.Item>
                    <div style={{ fontWeight: 'bold', marginBottom: '15px' }}>
                        Final Amount: ₹ {addedProducts.reduce((total, prod) => total + prod.price * prod.quantity, 0).toFixed(2)}
                    </div>
                    <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
                        Submit Quotation
                    </Button>
                </Form>
            </div>
        </Modal>
    );
};

export default QuotationFormModal;
