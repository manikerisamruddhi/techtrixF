import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, message, Radio } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createTicket } from '../../redux/slices/ticketSlice';
import { fetchCustomers } from '../../redux/slices/customerSlice';
import { fetchProducts } from '../../redux/slices/productSlice';
import {addQuotation} from '../../redux/slices/quotationSlice';
import { addProduct } from '../../redux/slices/productSlice';

const { Option } = Select;

const CreateTicketModalForm = ({ visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isChargeable, setIsChargeable] = useState(false); // State to track chargeability selection
    const [isPremiumCustomer, setIsPremiumCustomer] = useState(false); // State to track if customer is premium

    const { customers } = useSelector((state) => state.customers);
    const { items } = useSelector((state) => state.products);

    useEffect(() => {
        if (visible) {
            dispatch(fetchCustomers());
            dispatch(fetchProducts());
        }
    }, [dispatch, visible]);

    const handleCustomerChange = (value) => {
        const selectedCust = customers.find(customer => customer.id === value);
        setSelectedCustomer(selectedCust);

        // Check if the customer is premium and set state accordingly
        setIsPremiumCustomer(selectedCust?.isPremium || false);

        form.setFieldsValue({ ProductID: null });
        setSelectedProduct(null);
    };

    const handleProductChange = (value) => {
        const product = items.find((item) => item.id === value);
        setSelectedProduct(product);
        
        if (product) {
            form.setFieldsValue({ Description: product.description });
        } else {
            form.setFieldsValue({ Description: '' });
        }
    };

    const handleChargeabilityChange = (e) => {
        setIsChargeable(e.target.value === 'Chargeable'); // Set state based on selection
    };

    const onFinish = async (values) => {
        const currentDate = new Date().toISOString();
        const ticketData = {
        Title: values.Title,
        CustomerID: values.CustomerID,
        ProductID: values.ProductID,
        Priority: values.Priority,
        Chargeability: values.Chargeability,
        Status: 'Open',
        CreatedBy: 'Admin',
        CreatedDate: currentDate,
        Remark: values.Remark,
        };
    
        try {
            // Step 1: Create the ticket and get the TicketID from the response
            const resultAction = await dispatch(createTicket(ticketData));
    
            // Check if the ticket was created successfully
            if (createTicket.fulfilled.match(resultAction)) {
                const newTicketID = resultAction.payload.TicketID;  // Get TicketID from response
    
                message.success('Ticket created successfully!');
    
                // Step 2: If the ticket is chargeable, create the quotation and product using the TicketID
                if (isChargeable) {
                    const quotationValues = {
                        TicketID: newTicketID,  // Use the newly created TicketID
                        FinalAmount: values.FinalAmount,
                        CreatedDate: currentDate,
                    };
                    await dispatch(addQuotation(quotationValues));  // Dispatch addQuotation action
    
                    message.success('Quotation created successfully!');
    
                    const productValues = {
                        TicketID: newTicketID,  // Use the newly created TicketID
                        customerID: values.CustomerID,
                        description: values.NewProdDescription,
                        brand: 'Service-',
                        model_no: 'Service-',
                        price: values.FinalAmount
                    };
                    await dispatch(addProduct(productValues));  // Dispatch addProduct action
    
                    message.success('Product updated successfully!');
                }
    
                form.resetFields();
                onClose();
            } else {
                message.error('Failed to create ticket.');
            }
        } catch (error) {
            message.error(`Failed to create ticket: ${error.message}`);
        }
    };
    
    const filteredProducts = items.filter((product) => product.customerID === selectedCustomer?.id);

    return (
        <Modal
            visible={visible}
            title="Create Ticket"
            onCancel={onClose}
            footer={null}
        >
            <Form
                layout="vertical"
                onFinish={onFinish}
                form={form}
                className="create-ticket-form"
            >
                <Form.Item
                    name="Title"
                    label="Title"
                    rules={[{ required: true, message: 'Please enter the ticket title' }]}
                >
                    <Input placeholder="Enter ticket title" />
                </Form.Item>

                <Form.Item
                    name="CustomerID"
                    label="Customer"
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
                                <Option key={customer.id} value={customer.id} label={`${customer.FirstName} ${customer.LastName} ${customer.Email}`}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>{`${customer.FirstName} ${customer.LastName}`}</span>
                                        <span style={{ marginLeft: '10px', color: 'gray' }}>{customer.Email}</span>
                                    </div>
                                </Option>
                            ))
                        ) : (
                            <Option value="">No customers found</Option>
                        )}
                    </Select>
                </Form.Item>

             

                <Form.Item
                    name="ProductID"
                    label="Product"
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
                                <Option key={product.id} value={product.id} label={`${product.brand} ${product.model_no}`}>
                                    <div>
                                        <span style={{ marginRight: '10px' }}>Brand: {product.brand}</span>
                                        <span>Model No: {product.model_no}</span>
                                    </div>
                                </Option>
                            ))
                        ) : (
                            <Option value="">No products found for this customer</Option>
                        )}
                    </Select>
                </Form.Item>

                
                <Form.Item
                    name="Description"
                    label="Product Description"
                    rules={[{ required: true, message: 'Please enter the description' }]}
                >
                    <Input.TextArea
                        rows={4}
                        placeholder="Product description will appear here"
                        // value={selectedProduct ? selectedProduct.description : ''}
                        readOnly
                    />
                </Form.Item>

                {selectedProduct && selectedProduct.warranty_end_date && (
                    <>
                        <Form.Item>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '10px' }}>
                                  Warranty Status :
                                </span>
                                <span style={{ color: new Date(selectedProduct.warranty_end_date.replace(' ', 'T')) > new Date() ? 'green' : 'red' }}>
                                    {new Date(selectedProduct.warranty_end_date.replace(' ', 'T')) > new Date()
                                        ? "In Warranty"
                                        : "Out of Warranty"}
                                </span>
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

                           {/* Render the line if the customer is premium */}
                {isPremiumCustomer && (
                    <div style={{ marginBottom: '10px', color: 'green', fontWeight: 'bold' }}>
                        This customer is a Premium customer.
                    </div>
                )}

                        <Form.Item
                            name="Chargeability"
                            label="Chargeability"
                            rules={[{ required: true, message: 'Please select chargeability' }]}
                        >
                            <Radio.Group onChange={handleChargeabilityChange}>
                                <Radio value="Chargeable">Chargeable</Radio>
                                <Radio value="NonChargeable">Non-chargeable</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </>
                )}

                {/* Conditionally render the quotation fields if chargeable is selected */}
                {isChargeable && (
                    <>
                        <h3>Quotation Details</h3>
                        <Form.Item
                            name="FinalAmount"
                            label="Quotation Amount"
                            rules={[{ required: true, message: 'Please enter quotation amount' }]}
                        >
                            <Input placeholder="Enter quotation amount" />
                        </Form.Item>
                        <Form.Item
                            name="NewProdDescription"
                            label="Quotation Description (new product description)"
                            rules={[{ required: true, message: 'Please enter quotation description' }]}
                        >
                            <Input.TextArea rows={4} placeholder="Enter quotation description" />
                        </Form.Item>
                    </>
                )}

                <Form.Item
                    name="Priority"
                    label="Priority"
                    rules={[{ required: true, message: 'Please select priority' }]}
                >
                    <Select placeholder="Select priority">
                        <Option value="Low">Low</Option>
                        <Option value="Medium">Medium</Option>
                        <Option value="High">High</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="Remark"
                    label="Remark"
                    rules={[{ required: true, message: 'Add a remark' }]}
                >
                    <Input.TextArea
                     rows={2}
                    placeholder="Enter a remark" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit Ticket
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateTicketModalForm;
