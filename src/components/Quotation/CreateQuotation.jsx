import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, Row, Col, Input, Button, Table, notification, Radio, Select, message } from 'antd';
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
import { addProduct, fetchNonCustProducts } from '../../redux/slices/productSlice';
import { createTicket, updateTicket } from '../../redux/slices/ticketSlice'
import moment from 'moment';
import CreateCustomerForm from '../Customer/CreateCustomerForm';
import { useNavigate } from 'react-router-dom';

const currentDate = moment();
const { Option } = Select; // Destructure Option from Select

const QuotationFormModal = ({ visible, onClose, defticketId, defaultCustomer }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { quotations, loading: quotationsLoading, error } = useSelector(state => state.quotations);
    const { customers } = useSelector(state => state.customers); // Assuming customer data is fetched through Redux
    const [customer, setCustomer] = useState(null);
    const { items: products } = useSelector(state => state.products); // Assuming you have products in your Redux store
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // useEffect(() => {
    //     console.log(`defticket : ${defticketId} and ${defaultCustomer}`);
    // }, [defticketId]);


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
        isSerialNoAllowed: false,
        partCode: '',
        productType: 'Hardware',
        productId: null // Add productId to newProduct state

    });
    const [showNewProductForm, setShowNewProductForm] = useState(false);
    const [addedProducts, setAddedProducts] = useState([]);
    const [editIndex, setEditIndex] = useState(null); // To track which product is being edited
    const [customerType, setCustomerType] = useState('existing'); // Track customer type
    const [existingCustomer, setExistingCustomer] = useState(undefined); // Track selected existing customer
    const [serviceProductIds, setServiceProductIds] = useState();

    const [productType, setProductType] = useState('Hardware'); // Default selection is Hardware    
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

    const [taxes, setTaxes] = useState('');
    const [delivery, setDelivery] = useState('');
    const [payment, setPayment] = useState('');
    const [warrantyOrSupport, setWarrantyOrSupport] = useState('');
    const [transport, setTransport] = useState('');
    const [validity, setValidity] = useState(0);

    // const [NticketId, setNticketId] = useState(null);
    const NticketId = useRef(null);
    const Quote = useRef(null);
    const [QuoteState, SetQuoteState] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state


    useEffect(() => {
        if (visible) {
            // dispatch(fetchQuotations());
            if (!customers || customers.length === 0) {
                dispatch(fetchCustomers()); // Fetch customers if not present in the state
            }
            dispatch(fetchNonCustProducts()); // Fetch products when the modal is visible
        }
    }, [dispatch, visible, customers]);

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
        // Scroll to the Add Product form when showNewProductForm changes to true
        if (showNewProductForm && addProductFormRef.current) {
            addProductFormRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showNewProductForm]);

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
                    } else if (defaultCustomer) {

                        handleCustomerChange(defaultCustomer);
                        // If a default customer and ticket ID exist, fetch the quotation by ticket ID
                        // console.log(`Using existing ticket ID: ${defticketId}`);
                        fetchedQuote = await dispatch(getQuotationByTicketId(defticketId)).unwrap();
                        NticketId.current = defticketId;


                        // console.log(existingCustomer);
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
                            validity: 0,
                        };
                        // console.log(`Quotation data to add: ${quotationData}`, JSON.stringify(fetchedQuote, null, 2));
                        // Dispatch the thunk action to add a new quotation
                        const addedQuote = await dispatch(addQuotation(quotationData)).unwrap();
                        // SetQuote(addedQuote); // Store the newly added quotation in state
                        Quote.current = addedQuote;
                        // console.log(`Added quotation: ${addedQuote}`);
                    }
                    // console.log(Quote.current);
                    SetQuoteState(Quote.current);
                } catch (error) {
                    // Log any errors that occur during the fetching or creating process
                    console.error('Error fetching or creating quotation:', error);
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
    }, [visible]); // Dependencies for the useEffect hook




    const handleProductSelect = async (value) => {
        const selectedProduct = products.find(product => product.productId === value);
        if (selectedProduct) {
            const productWithKey = { ...selectedProduct, key: Date.now() }; // Add a unique key for rendering
            setAddedProducts(prev => [...prev, productWithKey]); // Add the selected product to addedProducts
            // console.log(addedProducts);
            notification.success({ message: 'Product added successfully!' });
        }
    };

    const handleAddOrEditProduct = () => {
        // Validation Logic
        if (newProduct.price <= 0 || newProduct.quantity <= 0) {
            notification.error({ message: 'Please fill price and quantity correctly!' });
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
        setNewProduct({ brand: '', modelNo: '', price: 0, quantity: 1, description: '', isSerialNoAllowed: false, productType: 'Hardware', productId: null });
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

        // Calculate total amount including GST
        return addedProducts.reduce((total, prod) => {
            const gstAmount = (prod.price * (prod.gst / 100)) * prod.quantity; // Calculate GST for the product
            return total + (prod.price * prod.quantity) + gstAmount; // Add base price and GST to total
        }, 0);
    };

    const handleFinish = async () => {
        setLoading(true); // Set loading to true when the function starts
        try {
            // Validate customer selection
            if (customerType === 'existing' && !existingCustomer) {
                notification.error({ message: 'Please select an existing customer.' });
                setLoading(false); // Set loading to false if validation fails
                return;
            }

            // Check for null or zero prices in added products
            const hasInvalidPrice = addedProducts.some(product => product.price === null || product.price <= 0);
            if (hasInvalidPrice) {
                notification.error({ message: 'Please fill in the price for all selected products before submitting the quotation.' });
                setLoading(false); // Set loading to false if validation fails
                return;
            }

            // Validate required fields
            if (!payment || !transport || !validity || !delivery || !warrantyOrSupport) {
                notification.error({ message: 'Please fill in all required fields (Payment, Transport, Validity, delivery, warranty).' });
                setLoading(false); // Set loading to false if validation fails
                return;
            }

            // Create a new customer if necessary
            let customerId;
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

                try {
                    // console.log('Adding new customer:', newCustomerData);
                    const customerResponse = await dispatch(addCustomer(newCustomerData)).unwrap();
                    // console.log('Customer added:', customerResponse);
                    customerId = customerResponse.customerId;

                    const values = {
                        customerId: customerId,
                    };

                    // console.log(`Updating ticket with ${NticketId.current} and ${values.data}`);
                    await dispatch(updateTicket({ ticketId: defticketId || NticketId.current, data: values }));
                } catch (err) {
                    notification.error({ message: err, description: `for adding new customer` });
                    setLoading(false); // Set loading to false if adding customer fails
                    return;
                }
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
            const addedProductIds = []; // Array to hold product IDs to be added to quotationProducts
            const productPromises = addedProducts.map(async (product) => {
                const newProductData = {
                    brand: product.brand,
                    modelNo: product.modelNo,
                    price: product.price,
                    quantity: product.quantity,
                    description: product.description,
                    isSerialNoAllowed: product.isSerialNoAllowed,
                    partCode: product.partCode,
                    hsnCode: product.hsnCode,
                    unitOfMeasurement: product.unitOfMeasurement,
                    gst: product.gst,
                    warrantyMonths: product.warranty,
                    productType: product.productType === 'ServiceF' ? 'Service' : product.productType,
                    customerId: customer.customerId // Pass customerId in the product data
                };

                const addedProduct = await dispatch(addProduct(newProductData)).unwrap();
                addedProductIds.push(addedProduct.productId); // Push the newly added product's ID
                return addedProduct;
            });

            const addedProductsResponse = await Promise.all(productPromises);
            // console.log(addedProductsResponse);
            // console.log(addedProductIds);
            // console.log(NticketId.current.value);

            // Create a new quotation
            const quotationData = {
                ticketId: NticketId !== null ? NticketId.current : defticketId,
                customerId: customerId,
                status: 'Pending',
                createdBy: loggedInUserId,
                createdDate: currentDate.format('YYYY-MM-DD HH:mm:ss'),
                comments: comment,
                taxes,
                delivery,
                payment,
                warrantyOrSupport,
                transport,
                validity,
            };

            const quotationResponse = await dispatch(updateQuotation({ quotationId: Quote.current.quotationId, data: quotationData })).unwrap();
            // console.log('Quotation updated:', quotationResponse);

            // Create entries in quotationProducts table for each product
            const quotationProductPromises = addedProductIds.map(async (productId, index) => {
                const quotationProductsData = {
                    quotationId: quotationResponse.quotationId, // Use the ID from the created or updated quotation
                    productId: productId,
                };

                // Adding a delay of 0.5 second before each API call
                if (index > 0) await sleep(500);

                // console.log('Adding quotation product:', quotationProductsData);
                const quotationProductResponse = await dispatch(addQuotaionProduct(quotationProductsData)).unwrap();
                return quotationProductResponse;
            });

            const quotationProductsResponses = await Promise.all(quotationProductPromises);
            // console.log('Quotation products added:', quotationProductsResponses);

            navigate('/Quotations')
            notification.success({ message: 'Quotation added successfully!' });
            form.resetFields();
            setAddedProducts([]);
            setCustomerType('existing'); // Reset customer type
            setNewCustomer({ firstName: '', lastName: '', email: '', phoneNumber: '', address: '', pinCode: '', isPremium: false }); // Reset new customer data
            setFinalAmount(0); // Reset final amount
            setComment(''); // Reset comment

            onClose(); // Close modal after submission
            dispatch(fetchQuotations());

        } catch (err) {
            // console.error(err);
            notification.error({ message: 'Error adding quotation', description: err.data });
            // message.error(err.data);
        } finally {
            setLoading(false); // Set loading to false when the function ends
        }
    };




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
                        rules={[{ required: true, message: 'Please select an existing customer' }]}>
                        <Select
                            value={existingCustomer ? existingCustomer.customerId : undefined}
                            showSearch
                            placeholder="Select a customer"
                            optionFilterProp="label"
                            onChange={handleExistingCustomerChange}
                            disabled={!!defaultCustomer}
                        >
                            {customers && customers.length > 0 ? (
                                customers.map(customer => (
                                    <Option key={customer.customerId} value={customer.customerId} label={`${customer.firstName} ${customer.lastName} ${customer.email} ${customer.phoneNumber} ${customer.companyName}`}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>{`${customer.companyName} `}</span>
                                            {/* <span style={{ marginLeft: '10px', color: 'gray' }}>{customer.email}</span> */}
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

                <Row gutter={16}>
                    <Col span={12}>
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
                                            key={product.productId}
                                            value={product.productId}
                                            label={`${product.brand} || ${product.modelNo} || ₹${product.description}`}>
                                            {product.brand} || {product.modelNo} || ₹{product.description}
                                        </Select.Option>
                                    ))
                                ) : (
                                    <Select.Option value="">No products found</Select.Option>
                                )}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <div style={{ display: 'flex', justifyContent: 'right' }}>
                            {/* Add New Product Button */}
                            <Button type="" style={{ marginBottom: '20px', color: 'green' }} onClick={handleAddProductClick}>
                                Add New Product
                            </Button>
                        </div>
                    </Col>
                </Row>

                {/* Products Table */}

                {addedProducts.length > 0 ? (
                    <Table
                        columns={[
                            { title: 'Brand', dataIndex: 'brand', key: 'brand' },
                            { title: 'Model No', dataIndex: 'modelNo', key: 'modelNo' },
                            { title: 'Description', dataIndex: 'description', key: 'description' },
                            { title: 'Price', dataIndex: 'price', key: 'price' },
                            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
                            { title: 'GST (%)', dataIndex: 'gst', key: 'gst' }, // Update to show GST percentage
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
                                    <strong>₹ {calculateTotalAmount()} </strong>
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
                                    setNewProduct({
                                        brand: '',
                                        modelNo: '',
                                        price: 0,
                                        quantity: 1,
                                        description: '',
                                        isSerialNoAllowed: false,
                                        partCode: '',
                                        productType: 'Hardware',
                                        productId: null // Reset productId
                                    });
                                    setEditIndex(null);
                                }}
                            />
                        </div>

                        {/* Product Type Selection */}
                        <Form.Item label="Product Type">
                            <Radio.Group value={productType}
                                onChange={e => {
                                    const selectedProductType = e.target.value;
                                    setProductType(selectedProductType); // Update local state if needed
                                    setNewProduct(prev => ({ ...prev, productType: selectedProductType })); // Update newProduct with selected productType
                                }}>
                                <Radio value="Hardware">Hardware</Radio>
                                <Radio value="ServiceF">Service</Radio>
                            </Radio.Group>
                        </Form.Item>

                        {productType === 'Hardware' && (
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Brand" rules={[{ required: true }]}>
                                        <Input value={newProduct.brand} onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Model No" rules={[{ required: true }]}>
                                        <Input value={newProduct.modelNo} onChange={e => setNewProduct({ ...newProduct, modelNo: e.target.value })} />
                                    </Form.Item>
                                </Col>

                            </Row>

                        )}
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

                        {productType === 'Hardware' && (

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
                        )}

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Price" rules={[{ required: true }]}>
                                    <Input
                                        type="number"
                                        value={newProduct.price}

                                        // rules={[{ required: true, message: 'Please input the part code!' }]}
                                        onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="GST :"
                                    // labelCol={{ span: 8 }}
                                    // wrapperCol={{ span: 16 }}
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
                            {productType === 'Hardware' && (
                                <Col span={8}>
                                    <Form.Item label="Quantity"
                                        rules={[{ required: true }]}
                                    >
                                        <Input
                                            type="number"
                                            value={newProduct.quantity}
                                            onChange={e => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
                                        />
                                    </Form.Item>
                                </Col>



                            )}
                            {productType === 'ServiceF' && (
                                <Col span={8}>
                                    <Form.Item
                                        label="Quantity"
                                        name="quantity"
                                        initialValue={1} // Set the default value
                                        rules={[{ required: true }]}
                                    >
                                        <Input
                                            type="number"
                                            value={1} // Ensure the input always shows "1"
                                            disabled // Disable the input
                                        />
                                    </Form.Item>
                                </Col>
                            )}

                        </Row>

                        {productType === 'Hardware' && (
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="is Serial No."
                                    // labelCol={{ span: 12 }}
                                    // wrapperCol={{ span: 12 }}
                                    >
                                        <Radio.Group
                                            value={newProduct.isSerialNoAllowed}
                                            onChange={e => setNewProduct({ ...newProduct, isSerialNoAllowed: e.target.value })}
                                            style={{ display: 'inline-block' }}
                                        >
                                            <Radio value={true}>Yes</Radio>
                                            <Radio value={false}>No</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item label="Warranty months:" rules={[{ required: true }]}
                                    // labelCol={{ span: 16 }}
                                    // wrapperCol={{ span: 8 }}
                                    >
                                        <Input
                                            type="number"
                                            value={newProduct.warranty}
                                            onChange={e => setNewProduct({ ...newProduct, warranty: parseFloat(e.target.value) })}
                                        />
                                    </Form.Item>
                                </Col>

                            </Row>


                        )}
                        <div style={{ textAlign: 'right' }}>
                            <Button type="primary" onClick={handleAddOrEditProduct}>
                                {editIndex !== null ? 'Update Product' : 'Add Product'}
                            </Button>
                        </div>
                    </div>
                )}

                <Form>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Comment" rules={[{ required: true, message: 'Add a comment' }]}>
                                <Input.TextArea
                                    rows={2}
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Delivery" rules={[{ required: true, message: 'Please input delivery details!' }]}>
                                <Input value={delivery} onChange={e => setDelivery(e.target.value)} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Payment" rules={[{ required: true, message: 'Please input payment details!' }]}>
                                <Input value={payment} onChange={e => setPayment(e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Warranty or Support" rules={[{ required: true, message: 'Please input warranty or support details!' }]}>
                                <Input value={warrantyOrSupport} onChange={e => setWarrantyOrSupport(e.target.value)} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Transport" rules={[{ required: true, message: 'Please input transport details!' }]}>
                                <Input value={transport} onChange={e => setTransport(e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Validity (days)" rules={[{ required: true, message: 'Please input validity!' }]}>
                                <Input type="number" value={validity} onChange={e => setValidity(parseInt(e.target.value))} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <Button onClick={onClose} style={{ marginRight: '10px' }}>
                        Cancel
                    </Button>
                    <Button type="primary" onClick={handleFinish} disabled={addedProducts.length === 0 || loading} loading={loading}>
                        Submit Quotation
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default QuotationFormModal;