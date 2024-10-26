import React, { useEffect, useState , useRef} from 'react';
import { Modal, Form, Row, Col, Input, Button, Table, notification, Radio, Select, Switch } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addQuotation, resetError } from '../../redux/slices/quotationSlice';
import { fetchCustomers, addCustomer } from '../../redux/slices/customerSlice'; // Assuming a customer slice exists to fetch customers
import { addProduct, fetchProducts } from '../../redux/slices/productSlice';
import moment from 'moment';
import CreateCustomerForm from '../Customer/CreateCustomerForm';

const currentDate = moment();

const QuotationFormModal = ({ visible, onClose, ticketId, defaultCustomer }) => {
    const dispatch = useDispatch();
    const { quotations, loading, error } = useSelector(state => state.quotations);
    const { customers } = useSelector(state => state.customers); // Assuming customer data is fetched through Redux
    const [customer, setCustomer] = useState(null);
    const { items: products } = useSelector(state => state.products); // Assuming you have products in your Redux store
    
    const loggedInUser = JSON.parse(localStorage.getItem('user')); // Get user from local storage
    // const loggedInUserName = `${loggedInUser.firstName} ${loggedInUser.lastName}`
    const looggedInUserId = loggedInUser.id;

    // console.log('Fetched Products:', products);
    const addProductFormRef = useRef(null);

    useEffect(() => {
        if (defaultCustomer) {
            setCustomer(defaultCustomer);
        }
    }, [defaultCustomer]);

    // console.log(customer);


    const [form] = Form.useForm();
    const [newProduct, setNewProduct] = useState({
        brand: '',
        modelNo: '',
        price: 0,
        quantity: 1,
        description: '',
        hasSerialNumber: 'no',
    });
    const [showNewProductForm, setShowNewProductForm] = useState(false);
    const [addedProducts, setAddedProducts] = useState([]);
    const [editIndex, setEditIndex] = useState(null); // To track which product is being edited
    const [customerType, setCustomerType] = useState('existing'); // Track customer type
    const [existingCustomer, setExistingCustomer] = useState(undefined); // Track selected existing customer
    const [newCustomer, setNewCustomer] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        pinCode: '',
        isPremium: false,
    });
    const [finalAmount , setFinalAmount] = useState(0); // Track final amount
    const [comment, setComment] = useState(''); // Track comment

    useEffect(() => {
        if (visible) {
            // dispatch(fetchQuotations());
            dispatch(fetchCustomers()); // Fetch customers when the modal is visible
            dispatch(fetchProducts()); // Fetch products when the modal is visible
        }
    }, [dispatch, visible]);

    useEffect(() => {
        if (error) {
            notification.error({ message: error });
            dispatch(resetError()); // Reset error after showing
        }
    }, [error, dispatch]);

    const handleCustomerChange = (value) => {
        const selectedCust = customers.find(customer => customer.customerId === value);
        setExistingCustomer(selectedCust);
    };

    const handleProductSelect = (value) => {
        const selectedProduct = products.find(product => product.id === value);
        if (selectedProduct) {
            const productWithKey = { ...selectedProduct, key: Date.now() }; // Add a unique key for rendering
            setAddedProducts(prev => [...prev, productWithKey]); // Add the selected product to addedProducts
            notification.success({ message: 'Product added successfully!' });
        }
    };

    const handleAddOrEditProduct = () => {
        // Validation Logic
        if (!newProduct.brand || !newProduct.modelNo || newProduct.price <= 0 || newProduct.quantity <= 0) {
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
        setNewProduct({ brand: '', modelNo: '', price: 0, quantity: 1, description: '', hasSerialNumber: 'no' });
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
                    phoneNumber: newCustomer.phoneNumber,
                    address: newCustomer.address,
                    PinCode: newCustomer.pinCode,
                    isPremium: newCustomer.isPremium,
                    createdDate: currentDate.format('YYYY-MM-DD HH:mm:ss'),
                };
                //console.log('Adding new customer:', newCustomerData);
                const customerResponse = await dispatch(addCustomer(newCustomerData));
                //console.log('Customer added:', customerResponse);
            }

            // Create new products
            const productPromises = addedProducts.map(async (product) => {
                const newProductData = {
                    brand: product.brand,
                    modelNo: product.modelNo,
                    price: product.price,
                    quantity: product.quantity,
                    description: product.description,
                    hasSerialNumber: product.hasSerialNumber,
                    warrenty: product.warrenty,
                };
                //console.log('Adding new product:', newProductData);
                const productResponse = await dispatch(addProduct(newProductData));
                //console.log('Product added:', productResponse);
            });
            await Promise.all(productPromises);

            // Create a new quotation
            const quotationData = {
                TicketID: ticketId,
                customerId: customerType === 'existing' ? existingCustomer.id : newCustomer.customerId,
                ProductId: addedProducts.map(product => product.id),
                FinalAmount: addedProducts.reduce((total, prod) => total + prod.price * prod.quantity, 0),
                status: 'Pending',
                createdBy: looggedInUserId,
                isQuotationCreated: true,
                // finalAmount,
                createdDate: currentDate.format('YYYY-MM-DD HH:mm:ss'),
                Comments: comment,
            };

            //console.log('Adding new quotation:', quotationData);
            const quotationResponse = await dispatch(addQuotation(quotationData));
            console.log('Quotation added:', quotationResponse,
                'sent this data:', quotationData
            );

            notification.success({ message: 'Quotation added successfully!' });
            form.resetFields();
            setAddedProducts([]);
            setCustomerType('existing'); // Reset customer type
            setNewCustomer({ firstName: '', lastName: '', email: '', phoneNumber: '', address: '', pinCode: '', isPremium: false }); // Reset new customer data
            setFinalAmount(0); // Reset final amount
            setComment(''); // Reset comment
            onClose(); // Close modal after submission
        } catch (err) {
            console.error(err);
            notification.error({ message: 'Error adding quotation' });
        }
    };

    const handleExistingCustomerChange = value => {
        setExistingCustomer(customers.find(cust => cust.id === value));
    };

    const calculateTotalAmount = () => {
        // Check if any product has a null, undefined, or invalid quantity
        const hasInvalidQuantity = addedProducts.some(prod => prod.quantity == null || prod.quantity <= 0);
        
        if (hasInvalidQuantity) {
            const Quant = <span style={{color:'lightred'}}>
            Please update quantity
            </span>
            return Quant; // Return the message if any quantity is invalid
        }
        
        // Calculate total amount if all quantities are valid
        return addedProducts.reduce((total, prod) => total + (prod.price * prod.quantity), 0);
    };

    useEffect(() => {
        // Scroll to the Add Product form when showNewProductForm changes to true
        if (showNewProductForm && addProductFormRef.current) {
            addProductFormRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showNewProductForm]); 

    const handleAddProductClick = () => {
        setShowNewProductForm(true);
        // Scroll to the Add Product form
        if (addProductFormRef.current) {
            addProductFormRef.current.scrollIntoView({ behavior: 'smooth' });
        }
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
                    <Radio.Group value={customerType} 
                    disabled={!!defaultCustomer} 
                    onChange={e => setCustomerType(e.target.value)}>
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
                           value={defaultCustomer ? customer : undefined}
                            showSearch
                            placeholder="Select a customer"
                            optionFilterProp="label"
                            onChange={handleExistingCustomerChange}
                            disabled={!!defaultCustomer} 
                            
                        >
                            {customers && customers.length > 0 ? (
                                customers.map(customer => (
                                    <Option key={customer.customerId} value={customer.customerId} label={`${customer.firstName} ${customer.lastName} ${customer.email} ${customer.phoneNumber}`}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>{`${customer.firstName} ${customer.lastName}`}</span>
                                            <span style={{ marginLeft: '10px', color: 'gray' }}>{customer.email}</span>
                                        </div>
                                    </Option>
                                ))
                            ) : (
                                <Option value="">No customers found</Option>
                            )}
                        </Select>
                    </Form.Item>
                )}

                {customerType === 'new' && (
                    <CreateCustomerForm customer={newCustomer} setCustomer={setNewCustomer} />
                )}

                {/* Products Table */}

                {addedProducts.length > 0 ? (
                    <Table
                        columns={[
                            { title: 'Brand', dataIndex: 'brand', key: 'brand' },
                            { title: 'Model No', dataIndex: 'modelNo', key: 'modelNo' },
                            { title: 'description', dataIndex: 'description', key: 'description' },
                            { title: 'Price', dataIndex: 'price', key: 'price' },
                            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
                            // { title: 'Serial Number?', dataIndex: 'hasSerialNumber', key: 'hasSerialNumber',
                            //      render: text => (text === 'yes' ? 'Yes' : 'No') },
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
                                    <strong>₹ {calculateTotalAmount()}</strong>
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
                
                <Form.Item label="Select Existing Product">
    <Select
        showSearch
         optionFilterProp="label"
        placeholder="Select a product"
        onChange={handleProductSelect}
        style={{ width: '100%' }}
        dropdownStyle={{ maxHeight: 500, overflowY: 'auto' }} // Control dropdown height
      
    >
        {products && products.length > 0 ? (
            products.map(product => (
                <Select.Option 
                style={{ width: '100%', color: 'black', border: '1px', padding:'10px', }}
                key={product.id} value={product.id} label={`${product.brand} || ${product.modelNo} || ₹${product.description}`}>
                    {product.brand} || {product.modelNo} || ₹{product.description}
                </Select.Option>
            ))
        ) : (
            <Select.Option value="">No products found</Select.Option>
        )}
    </Select>
</Form.Item>
<div  style={{display:'flex',justifyContent:'right'}}>



    {/* Add New Product Button */}
                <Button type=""  style={{ marginBottom: '20px', color:'green' }} onClick={handleAddProductClick  }>
                    Add New Product
                </Button>
</div>
                

                {showNewProductForm && (
                    <div
                    ref={addProductFormRef} 
                        style={{
                            border: '2px solid #d9d9d9',
                            padding: '20px',
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9',
                            marginBottom: '10px',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px ' }}>
                            <h3>{editIndex !== null ? 'Edit Product' : 'Add Product'}</h3>
                            <Button
                                type="link"
                                icon={<CloseCircleOutlined />}
                                onClick={() => {
                                    setShowNewProductForm(false);
                                    setNewProduct({ brand: '', modelNo: '', price: 0, quantity: 1, description: '', hasSerialNumber: 'no' });
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
                                    <Input value={newProduct.modelNo} onChange={e => setNewProduct({ ...newProduct, modelNo: e.target.value })} />
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

                        <Row gutter={20}>
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

                            <Col span={7}>
                                <Form.Item label="Warrenty months:" rules={[{ required: true }]}
                                    labelCol={{ span: 16 }}
                                    wrapperCol={{ span: 8 }}>
                                    <Input
                                        type="number"
                                        value={newProduct.warrenty}
                                        onChange={e => setNewProduct({ ...newProduct, warrenty: parseFloat(e.target.value) })}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item label="Quantity" rules={[{ required: true }]}
                                    labelCol={{ span: 7 }}
                                    wrapperCol={{ span: 8 }}>
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