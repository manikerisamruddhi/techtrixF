import React, { useEffect, useState } from 'react';
import { Modal, Form, Row, Col, Input, Button, Table, notification, Radio, Select, Switch } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotations, addQuotation, resetError } from '../../redux/slices/quotationSlice';
import { fetchCustomers, addCustomer } from '../../redux/slices/customerSlice'; // Assuming a customer slice exists to fetch customers
import { addProduct } from '../../redux/slices/productSlice';

const QuotationFormModal = ({ visible, onClose, ticketId }) => {
    const dispatch = useDispatch();
    const { quotations, loading, error } = useSelector(state => state.quotations);
    const { customers } = useSelector(state => state.customers); // Assuming customer data is fetched through Redux

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
    const [customerType, setCustomerType] = useState('new'); // Track customer type
    const [existingCustomer, setExistingCustomer] = useState(undefined); // Track selected existing customer
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [finalAmount, setFinalAmount] = useState(0); // Track final amount
    const [comment, setComment] = useState(''); // Track comment

    useEffect(() => {
        if (visible) {
            dispatch(fetchQuotations());
            dispatch(fetchCustomers()); // Fetch customers when the modal is visible
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
        try {
          // Create a new customer
          if (customerType === 'new') {
            const newCustomerData = {
              firstName: newCustomer.firstName,
              lastName: newCustomer.lastName,
              email: newCustomer.email,
              phone: newCustomer.phoneNumber,
              address: newCustomer.address,
              zipCode: newCustomer.zipCode,
              isPremium: newCustomer.isPremium,
            };
            await addCustomer(newCustomerData);
          }
      
          // Create new products
          const productPromises = addedProducts.map(async (product) => {
            const newProductData = {
              brand: product.brand,
              modelNo: product.model_no,
              price: product.price,
              quantity: product.quantity,
              description: product.description,
              hasSerialNumber: product.hasSerialNumber,
            };
            await addProduct(newProductData);
          });
          await Promise.all(productPromises);
      
          // Create a new quotation
          const quotationData = {
            ticketId,
            customer: customerType === 'existing' ? existingCustomer : newCustomer,
            products: addedProducts,
            totalAmount: addedProducts.reduce((total, prod) => total + prod.price * prod.quantity, 0),
            finalAmount,
            comment,
          };
          await addQuotation(quotationData);
      
          notification.success({ message: 'Quotation added successfully!' });
          form.resetFields();
          setAddedProducts([]);
          setCustomerType('new'); // Reset customer type
          setNewCustomer({ name: '', email: '', phone: '' }); // Reset new customer data
          setFinalAmount(0); // Reset final amount
          setComment(''); // Reset comment
          onClose(); // Close modal after submission
        } catch (err) {
          console.error(err);
        }
      };

    const handleExistingCustomerChange = value => {
        setExistingCustomer(customers.find(cust => cust.id === value));
    };

    const calculateTotalAmount = () => {
        return addedProducts.reduce((total, prod) => total + prod.price * prod.quantity, 0);
    };

    return (
        <Modal
            title="Create Quotation"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={900}
            centered
        >
            <div className="quotation-modal" style={{ maxHeight: '600px', overflowY: 'auto' }}>

                {/* Customer Selection */}
                <div style={{ marginBottom: '20px' }}>
                    <h3>Select Customer</h3>
                    <Radio.Group value={customerType} onChange={e => setCustomerType(e.target.value)}>
                        <Radio value="new">New Customer</Radio>
                        <Radio value="existing">Existing Customer</Radio>
                    </Radio.Group>
                </div>

                {customerType === 'existing' && (
                    <Form.Item
                        label="Select Existing Customer"
                        rules={[{ required: true, message: 'Please select an existing customer' }]}
                    >
                        <Select
                            placeholder="Select an existing customer"
                            style={{ width: '100%', marginBottom: '20px' }}
                            onChange={handleExistingCustomerChange}
                        >
                            {customers && customers.length > 0 ? (
                                customers.map(customer => (
                                    <Select.Option key={customer.id} value={customer.id}>
                                        {`${customer.FirstName} ${customer.LastName} (${customer.Email})`}
                                    </Select.Option>
                                ))
                            ) : (
                                <Select.Option value="">No customers available</Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                )}

                {customerType === 'new' && (
                    <div style={{ border: '1px solid #d9d9d9', padding: '10px', borderRadius: '8px', backgroundColor: '#f9f9f9', marginBottom: '10px' }}>
                        <h4>New Customer Details</h4>
                        <Row gutter={20}>
                            <Col span={7}>
                                <Form.Item label="First Name" rules={[{ required: true, message: 'Please enter customer first name' }]}>
                                    <Input value={newCustomer.firstName} onChange={e => setNewCustomer({ ...newCustomer, firstName: e.target.value })} />
                                </Form.Item>
                            </Col>
                            <Col span={7}>
                                <Form.Item label="Last Name" rules={[{ required: true, message: 'Please enter customer last name' }]}>
                                    <Input value={newCustomer.lastName} onChange={e => setNewCustomer({ ...newCustomer, lastName: e.target.value })} />
                                </Form.Item>
                            </Col>
                            <Col span={7}>
                                <Form.Item label="Email" rules={[{ required: true, message: 'Please enter customer email' }]}>
                                    <Input type="email" value={newCustomer.email} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Phone" rules={[{ required: true, message: 'Please enter customer phone number' }]}>
                                    <Input value={newCustomer.phoneNumber} onChange={e => setNewCustomer({ ...newCustomer, phoneNumber: e.target.value })} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Address">
                                    <Input value={newCustomer.address} onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })} />
                                </Form.Item>
                            </Col>
                          
                            <Col span={8}>
                                <Form.Item label="Pin Code">
                                    <Input value={newCustomer.zipCode} onChange={e => setNewCustomer({ ...newCustomer, zipCode: e.target.value })} />
                                </Form.Item>
                            </Col>
                           
                            <Col span={8}>
                                <Form.Item label="Is Premium">
                                    <Switch checked={newCustomer.isPremium} onChange={e => setNewCustomer({ ...newCustomer, isPremium: e })} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                )}

                {/* Products Table */}

                {addedProducts.length > 0 ? (
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
                        summary={() => (
                            <Table.Summary.Row>
                                <Table.Summary.Cell colSpan={4} style={{ textAlign: 'right' }}>
                                    <strong>Total Amount:</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell>
                                    <strong>${calculateTotalAmount()}</strong>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        )}
                        style={{ marginBottom: '20px' }}
                    />
                ) : (
                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                        <p>No products added yet. Please add a product to continue.</p>
                    </div>
                )}

                {/* Add New Product Button */}
                <Button type="dashed" block style={{ marginBottom: '20px' }} onClick={() => setShowNewProductForm(true)}>
                    Add New Product
                </Button>

                {showNewProductForm && (
                    <div
                        style={{
                            border: '1px solid #d9d9d9',
                            padding: '20px',
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9',
                            marginBottom: '20px',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <h3>{editIndex !== null ? 'Edit Product' : 'Add Product'}</h3>
                            <Button
                                type="link"
                                icon={<CloseCircleOutlined />}
                                onClick={() => {
                                    setShowNewProductForm(false);
                                    setNewProduct({ brand: '', model_no: '', price: 0, quantity: 1, description: '', hasSerialNumber: 'no' });
                                    setEditIndex(null);
                                }}
                            />
                        </div>

                        <Row gutter={16}>
                            <Col span={7}>
                                <Form.Item label="Brand" rules={[{ required: true }]}>
                                    <Input value={newProduct.brand} onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Model No" rules={[{ required: true }]}>
                                    <Input value={newProduct.model_no} onChange={e => setNewProduct({ ...newProduct, model_no: e.target.value })} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Price" rules={[{ required: true }]}>
                                    <Input
                                        type="number"
                                        value={newProduct.price}
                                        onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={22}>
                            <Col span={8}>
                                <Form.Item
                                    label="is Serial No."
                                    labelCol={{ span: 12 }}
                                    wrapperCol={{ span: 12 }}
                                >
                                    <Radio.Group
                                        value={newProduct.hasSerialNumber}
                                        onChange={e => setNewProduct({ ...newProduct, hasSerialNumber: e.target.value })}
                                        style={{ display: 'inline-block' }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>

                            <Col span={5}>

                            </Col>

                            <Col span={8}>
                                <Form.Item label="Quantity" rules={[{ required: true }]}>
                                    <Input
                                        type="number"
                                        value={newProduct.quantity}
                                        onChange={e => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
                                    />
                                </Form.Item>
                            </Col>

                        </Row>

                        <Row>
                            <Col span={24}>
                                <Form.Item label="Description">
                                    <Input.TextArea
                                        rows={3}
                                        value={newProduct.description}
                                        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <div style={{ textAlign: 'right' }}>
                            <Button type="primary" onClick={handleAddOrEditProduct}>
                                {editIndex !== null ? 'Update Product' : 'Add Product'}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Final Amount & Comment */}
                {/* <Row gutter={16}> */}
                {/* <Col span={12}>
                        <Form.Item label="Final Amount" rules={[{ required: true }]}>
                            <Input
                                type="number"
                                value={finalAmount}
                                onChange={e => setFinalAmount(parseFloat(e.target.value))}
                            />
                        </Form.Item>
                    </Col> */}
                {/* <Col span={12}> */}
                <Form.Item label="Comment">
                    <Input.TextArea
                        rows={2}
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                    />
                </Form.Item>
                {/* </Col> */}
                {/* </Row> */}

                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <Button onClick={onClose} style={{ marginRight: '10px' }}>
                        Cancel
                    </Button>
                    <Button type="primary" onClick={handleFinish} disabled={addedProducts.length === 0}>
                        Submit Quotation
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default QuotationFormModal;
