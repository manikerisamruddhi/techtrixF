import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, Row, Col, Input, Button, Table, notification, Radio, Select } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
    addQuotation, resetError, getQuotationByUserIdAndInitiatedStatus,
    getQuotationByTicketId,
    fetchQuotations,
    updateQuotation,
    addQuotaionProduct
} from '../../redux/slices/quotationSlice';
import { fetchCustomers, addCustomer } from '../../redux/slices/customerSlice'; // Assuming a customer slice exists to fetch customers
import { addProduct, fetchProducts } from '../../redux/slices/productSlice';
import { createTicket, updateTicket } from '../../redux/slices/ticketSlice'
import moment from 'moment';
import CreateCustomerForm from '../Customer/CreateCustomerForm';
import { Category } from '@mui/icons-material';

const currentDate = moment();
const { Option } = Select; // Destructure Option from Select

const QuotationFormModal = ({ visible, onClose, defticketId, defaultCustomer }) => {
    const dispatch = useDispatch();
    const { quotations, loading, error } = useSelector(state => state.quotations);
    const { customers } = useSelector(state => state.customers); // Assuming customer data is fetched through Redux
    const [customer, setCustomer] = useState(null);
    const { items: products } = useSelector(state => state.products); // Assuming you have products in your Redux store
    const [loggedInUserId, setLoggedInUserId] = useState(null);



    useEffect(() => {
        console.log(`defticket : ${defticketId} and ${defaultCustomer}`);
    }, [defticketId]);


    useEffect(() => {
        // Get user from local storage
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
            setLoggedInUserId(loggedInUser.userId);
            // console.log(`loggedInUser  ${loggedInUserId}`);
        }
    }, []); // Empty dependency array to run only once on mount


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
        partCode: '',

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
    const [finalAmount, setFinalAmount] = useState(0); // Track final amount
    const [comment, setComment] = useState(''); // Track comment

    // const [NticketId, setNticketId] = useState(null);
    const NticketId = useRef(null);
    const Quote = useRef(null);
    // const [Quote, SetQuote] = useState(null);


    useEffect(() => {
        if (visible) {
            dispatch(fetchQuotations());
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

    useEffect(() => {
        // console.log(`Updated NticketId: ${NticketId}`);
    }, [NticketId]);


    useEffect(() => {
        // console.log(`Updated customer: ${customer}`, JSON.stringify(customer, null, 2));
    }, [customer]);


    useEffect(() => {
        // Check if the component is visible
        if (visible) {
            const fetchData = async () => {
                try {
                    let fetchedQuote = null; // Initialize a variable to hold the fetched quotation
                    // If no default customer is set, attempt to fetch the quotation by user ID
                    if (!defaultCustomer) {
                        // Dispatch the thunk action to fetch the quotation
                        fetchedQuote = await dispatch(getQuotationByUserIdAndInitiatedStatus(loggedInUserId)).unwrap();

                        // Check if a quotation was successfully fetched
                        if (fetchedQuote) {
                            // SetQuote(fetchedQuote); // Store the fetched quotation in state
                            Quote.current = fetchedQuote;
                            // console.log(`Quotation fetched: ${fetchedQuote}`, JSON.stringify(fetchedQuote, null, 2));

                            NticketId.current = fetchedQuote.ticketId
                            // console.log(`Quotation fetched ticketId ${NticketId}`);
                        }
                        else {
                            // If no quotation was found, create a new ticket
                            // console.log('No quotation found, creating a new ticket...');
                            const ticketData = {
                                title: 'Order', // Title of the ticket
                                createdById: loggedInUserId, // ID of the user creating the ticket
                                description: 'Ticket for quotation', // Description of the ticket
                                category: 'Quotation', // Category of the ticket
                                ticketType: 'Order', // Type of the ticket
                            };

                            // Dispatch the thunk action to create a new ticket
                            const T = await dispatch(createTicket(ticketData)).unwrap();
                            NticketId.current = T.ticketId;
                            // console.log(`Ticket ID: ${T.ticketId}`);
                            // console.log(`Ticket ID N: ${NticketId.current}`);
                        }
                    } else if (defticketId) {
                        // If a default customer and ticket ID exist, fetch the quotation by ticket ID
                        // console.log(`Using existing ticket ID: ${defticketId}`);
                        fetchedQuote = await dispatch(getQuotationByTicketId(defticketId)).unwrap();
                        NticketId.current = defticketId;

                        // Check if a quotation was successfully fetched
                        if (fetchedQuote) {
                            // SetQuote(fetchedQuote); // Store the fetched quotation in state
                            Quote.current = fetchedQuote;
                            NticketId.current = fetchedQuote.ticketId;
                            // console.log(`Quotation fetched for ticket ID ${defticketId}:`, JSON.stringify(fetchedQuote, null, 2));

                        }
                    }

                    // If no quotation was found or created, add a new quotation
                    if (!fetchedQuote) {
                        // console.log(`hhhhhhh ${NticketId.current}`)
                        const quotationData = {
                            ticketId: NticketId !== null ? NticketId.current : 'NA', // Use the existing ticket ID or the new ticket ID
                            createdBy: loggedInUserId, // ID of the user creating the quotation
                        };
                        // console.log(`Quotation data to add: ${quotationData}`, JSON.stringify(fetchedQuote, null, 2));
                        // Dispatch the thunk action to add a new quotation
                        const addedQuote = await dispatch(addQuotation(quotationData)).unwrap();
                        // SetQuote(addedQuote); // Store the newly added quotation in state
                        Quote.current = addedQuote;
                        // console.log(`Added quotation: ${addedQuote}`);
                    }
                } catch (error) {
                    // Log any errors that occur during the fetching or creating process
                    // console.error('Error fetching or creating quotation:', error);
                }
            };
            if (Quote.current) {
                NticketId.current = Quote.current.ticketId;
                // console.log(`Quotation fetched ticketId ${NticketId}`);
            }

            // Call the fetchData function to execute the logic
            fetchData();

            // console.log('Current quotation state:', JSON.stringify(Quote, null, 2)); // Log the current state of the quotation
        }
    }, [visible, defaultCustomer, defticketId, loggedInUserId]); // Dependencies for the useEffect hook


    const handleFinish = async () => {
        try {
            // Validate customer selection
            if (customerType === 'existing' && !existingCustomer) {
                notification.error({ message: 'Please select an existing customer.' });
                return;
            }

            // Create a new customer if necessary
            let customerId;
            // console.log(`jjjjjjjjjjjjjjjjjjj ${customerType}`);
            if (customerType === 'new') {
                const newCustomerData = {
                    firstName: newCustomer.firstName,
                    lastName: newCustomer.lastName,
                    email: newCustomer.email,
                    phoneNumber: newCustomer.phoneNumber,
                    address: newCustomer.address,
                    pinCode: newCustomer.pinCode,
                    isPremium: newCustomer.isPremium,
                    createdDate: currentDate.format('YYYY-MM-DD HH:mm:ss'),
                };

                // console.log('Adding new customer:', newCustomerData);
                const customerResponse = await dispatch(addCustomer(newCustomerData)).unwrap();
                // console.log('Customer added:', customerResponse);
                customerId = customerResponse.customerId;

                const values = {
                    customerId: customerId,
                };

                // console.log(`Updating ticket with ${NticketId.current} and ${values.data}`);
                await dispatch(updateTicket({ ticketId: defticketId || NticketId.current, updatedTicket: values }));
            } else {
                customerId = defaultCustomer;
                // console.log(`existjjjjjjjjjjjjjjjjjjjjjjjjjing ${defaultCustomer} and ${defaultCustomer}`)
                const values = {
                    customerId: customerId || customer.customerId,
                    isQuotationCreated: true
                };

                // console.log(`Updating ticket with ${NticketId.current} and existing ${values.data}`);
                await dispatch(updateTicket({ ticketId: NticketId.current, data: values }));
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
                    partCode: product.partCode,
                    isSerialNoAllowed: product.isSerialNoAllowed,
                    hsnCode: product.hsnCode,
                    unitOfMeasurement: product.unitOfMeasurement,
                    gst: product.gst,
                    warrenty: product.warrenty,
                    productType: 'Hardware',
                    customerId: customerId || defaultCustomer || customer.customerId,
                };

                // console.log('Adding new product:', newProductData);
                const addedProduct = await dispatch(addProduct(newProductData)).unwrap();
                return addedProduct;
            });
            const addedProductsResponse = await Promise.all(productPromises);
            const addedProductIds = addedProductsResponse.map((product) => product.productId); // Assuming each `addedProduct` has a `productId` field

            // Create a new quotation
            const quotationData = {
                ticketId: NticketId !== null ? NticketId.current.value : defticketId,
                customerId: customerId,
                productId: addedProductIds,
                FinalAmount: addedProductsResponse.reduce((total, prod) => total + prod.price * prod.quantity, 0),
                status: 'Pending',
                createdBy: loggedInUserId,
                isQuotationCreated: true,
                createdDate: currentDate.format('YYYY-MM-DD HH:mm:ss'),
                comments: comment,
            };

            // console.log(`Updating quotation with data: ${JSON.stringify(quotationData, null, 2)}`);
            const quotationResponse = await dispatch(updateQuotation({ quotationId: Quote.current.quotationId, data: quotationData })).unwrap();
            // console.log('Quotation updated:', quotationResponse);


            // Create entries in quotationProducts table for each product
            const quotationProductPromises = addedProductIds.map(async (productId) => {
                const quotationProductsData = {
                    quotationId: quotationResponse.quotationId,
                    productId: productId,
                };

                // console.log('Adding quotation product:', quotationProductsData);
                const quotationProductResponse = await dispatch(addQuotaionProduct(quotationProductsData)).unwrap();
                return quotationProductResponse;
            });
            const quotationProductsResponses = await Promise.all(quotationProductPromises);
            // console.log('Quotation products added:', quotationProductsResponses);

            notification.success({ message: 'Quotation added successfully!' });
            form.resetFields();
            setAddedProducts([]);
            setCustomerType('existing'); // Reset customer type
            setNewCustomer({ firstName: '', lastName: '', email: '', phoneNumber: '', address: '', pinCode: '', isPremium: false }); // Reset new customer data
            setFinalAmount(0); // Reset final amount
            setComment(''); // Reset comment

            onClose(); // Close modal after submission
        } catch (err) {
            // console.error(err);
            notification.error({ message: 'Error adding quotation' });
        }
    };


    const handleProductSelect = (value) => {
        const selectedProduct = products.find(product => product.productId === value);
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


    const handleExistingCustomerChange = value => {
        const selectedCustomer = customers.find(cust => cust.customerId === value);
        setExistingCustomer(selectedCustomer);
        setCustomer(selectedCustomer); // Update the customer state if needed

    };

    const calculateTotalAmount = () => {
        // Check if any product has a null, undefined, or invalid quantity
        const hasInvalidQuantity = addedProducts.some(prod => prod.quantity == null || prod.quantity <= 0);

        if (hasInvalidQuantity) {
            const Quant = <span style={{ color: 'lightred' }}>
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
                            value={defaultCustomer ? customer?.customerId : undefined}
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
                                    style={{ width: '100%', color: 'black', border: '1px', padding: '10px', }}
                                    key={product.productId} value={product.productId} label={`${product.brand} || ${product.modelNo} || ₹${product.description}`}>
                                    {product.brand} || {product.modelNo} || ₹{product.description}
                                </Select.Option>
                            ))
                        ) : (
                            <Select.Option value="">No products found</Select.Option>
                        )}
                    </Select>
                </Form.Item>
                <div style={{ display: 'flex', justifyContent: 'right' }}>



                    {/* Add New Product Button */}
                    <Button type="" style={{ marginBottom: '20px', color: 'green' }} onClick={handleAddProductClick}>
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

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    label="HSN Code :"
                                // Add required rule if necessary
                                // rules={[{ required: true, message: 'Please input the HSN code!' }]}
                                >
                                    <Input
                                        value={newProduct.hsnCode}
                                        onChange={e => setNewProduct({ ...newProduct, hsnCode: e.target.value })}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    label="Unit of Measurement :"
                                // Add required rule if necessary
                                // rules={[{ required: true, message: 'Please input the unit of measurement!' }]}
                                >
                                    <Input
                                        value={newProduct.unitOfMeasurement}
                                        onChange={e => setNewProduct({ ...newProduct, unitOfMeasurement: e.target.value })}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    label="Part Code :"
                                // Add required rule if necessary
                                // rules={[{ required: true, message: 'Please input the part code!' }]}
                                >
                                    <Input
                                        value={newProduct.partCode}
                                        onChange={e => setNewProduct({ ...newProduct, partCode: e.target.value })}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={20}>
                            <Col span={7}>
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

                            <Col span={6}>
                                <Form.Item label="Quantity" rules={[{ required: true }]}
                                    labelCol={{ span: 7 }}
                                    wrapperCol={{ span: 10}}>
                                    <Input
                                        type="number"
                                        value={newProduct.quantity}
                                        onChange={e => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={4}>
        <Form.Item
            label="GST :"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16}}
            rules={[{ required: true, message: 'Please select GST!' }]}
        >
            <Select
                placeholder="Select GST"
                value={newProduct.gst}
                onChange={value => setNewProduct({ ...newProduct, gst: value })}
            >
                <Option value="18">18%</Option>
                <Option value="28">28%</Option>
                <Option value="0">None</Option>
            </Select>
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

                <Form.Item label="Comment">
                    <Input.TextArea
                        rows={2}
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                    />
                </Form.Item>


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