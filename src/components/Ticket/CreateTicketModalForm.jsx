    import React, { useEffect, useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Modal, Form, Input, Select, Button, message, Radio } from 'antd';
    import { useDispatch, useSelector } from 'react-redux';
    import { createTicket } from '../../redux/slices/ticketSlice';
    import { fetchCustomers } from '../../redux/slices/customerSlice';
    import { fetchProducts } from '../../redux/slices/productSlice';
    import { addQuotation } from '../../redux/slices/quotationSlice';
    import { addProduct } from '../../redux/slices/productSlice';
    import CustomerFormModal from '../Customer/CustomerFormModal';
    import ProductFormModal from '../../pages/Products/AddProduct';

    const { Option } = Select;

    const CreateTicketModalForm = ({ visible, onClose }) => {
        const navigate = useNavigate();
        const dispatch = useDispatch();
        const [form] = Form.useForm();
        const [selectedProduct, setSelectedProduct] = useState(null);
        const [selectedCustomer, setSelectedCustomer] = useState(null);
        const [isChargeable, setIsChargeable] = useState(false);
        const [isPremiumCustomer, setisPremiumCustomer] = useState(false);
        const [customerType, setCustomerType] = useState('existing');
        const [customerModalVisible, setCustomerModalVisible] = useState(false);
        const [customerMode, setCustomerMode] = useState('add');
        const [initialCustomerValues, setInitialCustomerValues] = useState({});
        const [newCustomer, setNewCustomer] = useState(null); // State to hold newly added customer
        const [productModalVisible, setProductModalVisible] = useState(false); // Product modal state
        const [newProduct, setNewProduct] = useState(null); // State to hold newly added product
        const [warrantyDetails, setWarrantyDetails] = useState(null); // State for warranty details

        const loggedInUser = JSON.parse(localStorage.getItem('user')); // Get user from local storage
        // const loggedInUserName = `${loggedInUser.firstName} ${loggedInUser.lastName}`
        const looggedInUserId = loggedInUser.userId;

        const { customers } = useSelector((state) => state.customers);
        const { items } = useSelector((state) => state.products);

        useEffect(() => {
            if (visible) {
                dispatch(fetchCustomers());
                dispatch(fetchProducts());
            } else {
                resetForm();
            }
        }, [dispatch, visible]);

        const resetForm = () => {
            setSelectedProduct(null);
            setIsChargeable(false);
            setisPremiumCustomer(false);
            setCustomerType('existing');
            form.resetFields();
        };

        const handleCustomerChange = (value) => {
            const selectedCust = customers.find(customer => customer.customerId === value);
            setSelectedCustomer(selectedCust);
            setisPremiumCustomer(selectedCust?.isPremium || false);
            form.setFieldsValue({ ProductID: null });
            setSelectedProduct(null);
        };

        const handleProductChange = (value) => {
            const product = items.find((item) => item.id === value);
            setSelectedProduct(product);

            if (product) {
            

                if (!newProduct) {
                    form.setFieldsValue({ Sdescription: product.description });
                    // console.log(`Description ${product.description}`)
                    setWarrantyDetails(product.warranty_end_date);
                } else {
                    // Clear description if a new product is being added
                    form.setFieldsValue({ Sdescription: newProduct.description });
                    setWarrantyDetails(null);
                }
            } else {
                form.setFieldsValue({ Description: '' });
            }
        };

        const onFinish = async (values) => {
            const currentDate = new Date().toISOString();
        
            // Prepare the ticket data according to the specified structure
            const ticketData = {
                createdById: looggedInUserId,
                title: values.title,
                description: values.description,
                status: 'Open',
                category: 'issue', // You can modify this if you have a different category
                assignedTo: null, // Assuming you have logic to assign users if needed
                customer: {
                    customerId: values.customerId || (newCustomer ? newCustomer.customerId : null), // Use new customer if available
                },
                isChargeable: values.isChargeable !== undefined ? values.isChargeable : true,
                isQuotationCreated: false, // Set to false as per the requirement
                ticketType: 'Issue', // You can modify this if you have a different ticket type
                products: [], // Initialize products array
                createdDate: currentDate,
            };
        
            // Add selected product(s) to the products array
            if (values.ProductID) {
                ticketData.products.push({ productId: values.ProductID });
            }
            // if (newProduct) {
            //     ticketData.products.push({ productId: newProduct.id });
            // }
        
            console.log(ticketData);
        
            try {
                const resultAction = await dispatch(createTicket(ticketData));
        
                if (createTicket.fulfilled.match(resultAction)) {
                    const newTicketID = resultAction.payload.id;
        
                    message.success('Ticket created successfully!');
                    
                    form.resetFields();
                    setSelectedProduct(null); // Reset selected product
                    setSelectedCustomer(null); // Reset selected customer
                    setNewCustomer(null); // Reset new customer state
                    setNewProduct(null); // Reset new product state
                    setCustomerType('existing'); // Reset customer type to default
                    setIsChargeable(false); // Reset chargeable state
                    setisPremiumCustomer(false); // Reset premium customer state
        
                    onClose();
                } else {
                    message.error('Failed to create ticket.');
                }
            } catch (error) {
                message.error(`Failed to create ticket: ${error.message}`);
            }
        };

        const filteredProducts = selectedCustomer ? items.filter((product) => product.customerId === selectedCustomer.customerId) : [];

        const openCustomerForm = () => {
            setCustomerModalVisible(true);
            setCustomerMode('add');
        };

        const handleCustomerAdded = (newCustomer) => {
            setSelectedCustomer(newCustomer);
            form.setFieldsValue({ customerId: newCustomer.customerId });
            setisPremiumCustomer(newCustomer.isPremium);
            setCustomerModalVisible(false);
            form.setFieldsValue({ customerName: `${newCustomer.firstName} ${newCustomer.lastName}` });
            setNewCustomer(newCustomer); // Update the new customer state
            // console.log(`newCustomer ${newCustomer}`);
        };

        const openProductForm = () => {
            setProductModalVisible(true); // Open product modal
        };

        const handleProductAdded = (newProduct) => {
            setSelectedProduct(newProduct); // Set the newly added product
            form.setFieldsValue({ ProductID: newProduct.id });
            setNewProduct(newProduct); // Update the new product state
            setProductModalVisible(false); // Close product modal
            handleProductChange(newProduct.id);
            // message.success('Product added successfully!');
        };

        return (
            <Modal
                visible={visible}
                title="Create Ticket"
                onCancel={onClose}
                footer={null}
                width={800}
                centered
            >
                <div style={{
                    maxHeight: '500px',
                    overflowY: 'auto',
                    padding: '20px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                }}>
                    <Form
                        layout="vertical"
                        onFinish={onFinish}
                        form={form}
                        className="create-ticket-form"
                    >
                        {/* Customer Type Selection */}
                        <Form.Item label="Customer Type" required>
                            <Radio.Group value={customerType} onChange={(e) => setCustomerType(e.target.value)}>
                                <Radio value="existing">Existing Customer</Radio>
                                <Radio value="new" onClick={openCustomerForm}>New Customer</Radio>
                            </Radio.Group>
                        </Form.Item>

                        {/* Conditional Rendering based on Customer Type */}
                        {customerType === 'existing' ? (
                            <Form.Item
                                name="customerId"
                                label="Customer :"
                                rules={[{ required: true, message: 'Please select a customer' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select a customer"
                                    optionFilterProp="label"
                                    onChange={handleCustomerChange}
                                >
                                    {customers && customers.length > 0 ? (
                                        customers.map(customer => (
                                            <Option key={customer.customerId} value={customer.customerId} label={`${customer.firstName} ${customer.lastName} ${customer.email} ${customer.phoneNumber} `}>
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
                        ) : (
                            <div>
                                <CustomerFormModal
                                    visible={customerModalVisible}
                                    onCancel={() => setCustomerModalVisible(false)}
                                    mode={customerMode}
                                    initialValues={initialCustomerValues}
                                    onAddCustomer={handleCustomerAdded}
                                />

                            </div>
                        )}
                        {customerType === 'new' && newCustomer && (
                            <div style={{ marginTop: '2px', marginBottom: '15px' }} >
                                <span style={{ color: 'green' }}>Newly Added Customer : </span>
                                <span>{`${newCustomer.firstName} ${newCustomer.lastName} `}</span>
                            </div>
                        )}

                        {customerType === 'existing' &&
                            <Form.Item
                                name="ProductID"
                                label="Product :"
                                rules={[{ required: true, message: 'Please select a product' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select a product"
                                    optionFilterProp="label"
                                    onChange={handleProductChange}
                                >
                                    {filteredProducts && filteredProducts.length > 0 ? (
                                        filteredProducts.map(product => (
                                            <Option key={product.id} value={product.id} label={`${product.brand} ${product.modelNo}`}>
                                                <div>
                                                    <span style={{ marginRight: '10px' }}>Brand: {product.brand}</span>
                                                    <span>Model No: {product.modelNo}</span>
                                                </div>
                                            </Option>
                                        ))
                                    ) : (
                                        <Option value="">No products found for this customer</Option>
                                    )}
                                </Select>
                            </Form.Item>
                        }

                        {newProduct && (
                            <div style={{ marginTop: '2px', marginBottom: '15px' }}>
                                <span style={{ color: 'green' }}>Newly Added Product: </span>
                                <span>{`Brand: ${newProduct.brand} , Model No: ${newProduct.modelNo}`}</span>
                                <br />
                                <div style={{
            marginTop: '15px',
            marginBottom: '2px',
        }}> Product Description:</div>
                            
                                <Input.TextArea
        value={newProduct.description}
        rows={4} // Adjust the number of rows as needed
        readOnly
        style={{
            marginTop: '15px',
            marginBottom: '2px',
        }}
    />
                            </div>
                        )}

                        {/* {customerType === 'new' && ( */}
                        <Form.Item>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button type="primary" onClick={openProductForm}>
                                    Add New Product
                                </Button>
                            </div>

                        </Form.Item>

                        <ProductFormModal
                            visible={productModalVisible}
                            onCancel={() => setProductModalVisible(false)}
                            onAddProduct={handleProductAdded}
                            customerId={newCustomer?.customerId}
                        />
                        {/* )} */}

                        <Form.Item
                            name="title"
                            label="Title :"
                            rules={[{ required: true, message: 'Please enter the ticket title' }]}
                        >
                            <Input placeholder="Enter ticket title" />
                        </Form.Item>

                        {selectedProduct && ( // Only show if a product is selected
                            <>
                                <Form.Item
                                    name="Sdescription"
                                    label="Product Description"
                                    // rules={[{ required: true, message: 'Please enter the description' }]}
                                >
                                    <Input.TextArea
                                        rows={4}
                                        placeholder="Product description will appear here"
                                        readOnly
                                    />
                                </Form.Item>

                                {!newProduct && (
                                    <>
                                        <Form.Item>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{ marginRight: '10px' }}>
                                                    Warranty status :
                                                </span>
                                                {selectedProduct && selectedProduct.warranty_end_date ? (
                                                    <span style={{ color: new Date(selectedProduct.warranty_end_date.replace(' ', 'T')) > new Date() ? 'green' : 'red' }}>
                                                        {new Date(selectedProduct.warranty_end_date.replace(' ', 'T')) > new Date()
                                                            ? "In Warranty"
                                                            : "Out of Warranty"}
                                                    </span>
                                                ) : (
                                                    <span style={{ color: 'gray' }}>No warranty information available</span>
                                                )}
                                            </div>
                                        </Form.Item>

                                        <Form.Item>
                                            <div>
                                                <span>Warranty End Date : </span>
                                                <span>
                                                    {new Date(selectedProduct.warranty_end_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </Form.Item>
                                    </>
                                )}

                                {isPremiumCustomer && (
                                    <div style={{ marginBottom: '10px', color: 'green', fontWeight: 'bold' }}>
                                        This customer is a Premium customer.
                                    </div>
                                )}

                                <Form.Item
                                    name="isChargeable"
                                    label="isChargeable : "
                                    rules={[{ required: true, message: 'Please select isChargeable' }]}
                                >
                                    {/* <Radio.Group onChange={handleisChargeableChange}> */}
                                    <Radio.Group >
                                        <Radio value={true}>Chargeable</Radio>
                                        <Radio value={false}>Non-chargeable</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </>
                        )}

                    
                        {/* <Form.Item
                            name="Priority"
                            label="Priority"
                            rules={[{ required: true, message: 'Please select priority' }]}
                        >
                            <Select placeholder="Select priority">
                                <Option value="Low">Low</Option>
                                <Option value="Medium">Medium</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item> */}


                        <Form.Item
                            name="description"
                            label="Description/Remark :"
                        // rules={[{ required: true, message: 'Add a description' }]}  //removed the compulsion
                        >
                            <Input.TextArea
                                rows={2}
                                placeholder="Enter a description" />
                        </Form.Item>

                        <Form.Item>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button type="primary" htmlType="submit">
                                    Submit Ticket
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        );
    };

    export default CreateTicketModalForm;
