import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createTicket } from '../../redux/slices/ticketSlice';
import { fetchCustomers } from '../../redux/slices/customerSlice';
import { fetchProducts } from '../../redux/slices/productSlice';

const { Option } = Select;

const CreateTicketModalForm = ({ visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null); // State for selected customer

    const { customers } = useSelector((state) => state.customers);
    const { items } = useSelector((state) => state.products);

    useEffect(() => {
        if (visible) {
            dispatch(fetchCustomers());
            dispatch(fetchProducts());
        }
    }, [dispatch, visible]);

    const handleCustomerChange = (value) => {
        console.log(value);
        setSelectedCustomer(value); // Update selected customer state
        form.setFieldsValue({ ProductID: null }); // Reset product selection
        setSelectedProduct(null); // Reset selected product
    };

    const handleProductChange = (value) => {
        const product = items.find((item) => item.id === value);
        setSelectedProduct(product);
        
        // Set the remark field to the selected product's description
        if (product) {
            form.setFieldsValue({ Description: product.description });
        } else {
            form.setFieldsValue({ Description: '' }); // Clear the description if no product is found
        }
    };

    const onFinish = async (values) => {
        const currentDate = new Date().toISOString();
        const modifiedValues = {
            ...values,
            TicketID: values.id || 6,
            Status: 'Open',
            CreatedBy: values.CreatedBy || 'Admin',
            CreatedDate: currentDate,
        };

        try {
            await dispatch(createTicket(modifiedValues));
            message.success('Ticket created successfully!');
            form.resetFields();
            onClose();
        } catch (error) {
            message.error(`Failed to create ticket: ${error.message}`);
        }
    };

    // Filter products based on the selected customer
    const filteredProducts = items.filter((product) => product.customerID === selectedCustomer);

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
                        onChange={handleCustomerChange} // Handle customer selection
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

                {/* Show warranty status and end date based on selected product */}
                {selectedProduct && selectedProduct.warranty_end_date && (
                    <>
                        <Form.Item>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '10px' }}>
                                    {new Date(selectedProduct.warranty_end_date.replace(' ', 'T')) > new Date()
                                        ? "In Warranty"
                                        : "Out of Warranty"}
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
                                <span>Warranty End Date: </span>
                                <span>
                                    {new Date(selectedProduct.warranty_end_date).toLocaleDateString()} {/* Format date as needed */}
                                </span>
                            </div>
                        </Form.Item>
                    </>
                )}

                <Form.Item
                    name="Description"
                    label="Product Description"
                    rules={[{ required: true, message: 'Please enter the description' }]}
                >
                    <Input.TextArea
                        rows={4}
                        placeholder="Product description will appear here"
                        value={selectedProduct ? selectedProduct.description : ''}
                        readOnly // Make the description read-only
                    />
                </Form.Item>

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
                    <Input placeholder="Enter a remark" />
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
