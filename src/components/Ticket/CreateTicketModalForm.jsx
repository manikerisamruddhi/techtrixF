import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createTicket } from '../../redux/slices/ticketSlice';
import { fetchCustomers, fetchProductsByCustomerId } from '../../redux/slices/customerSlice';

const { Option } = Select;

const CreateTicketModalForm = ({ visible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const { customers, selectedCustomerProducts } = useSelector((state) => state.customers);

    useEffect(() => {
        if (visible) {
            dispatch(fetchCustomers());
        }
    }, [dispatch, visible]);

    const handleCustomerChange = (customerId) => {
        // Fetch products for the selected customer
        dispatch(fetchProductsByCustomerId(customerId));
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
                        onChange={handleCustomerChange}
                    >
                        {customers.map(customer => (
        <Option key={customer.id} value={`${customer.FirstName} ${customer.LastName} ${customer.Email}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{`${customer.FirstName} ${customer.LastName}`}</span>
                <span style={{ marginLeft: '10px', color: 'gray' }}>{customer.Email}</span>
            </div>
        </Option>
    ))}
</Select>
                </Form.Item>

                {/* Product Selection Field */}
                <Form.Item
                    name="ProductID"
                    label="Product"
                    rules={[{ required: true, message: 'Please select a product' }]}
                >
                    <Select
                        showSearch
                        placeholder="Select a product"
                    >
                        {selectedCustomerProducts.map(product => (
                            <Option key={product.id} value={product.id}>
                                {product.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="Description"
                    label="Description"
                    rules={[{ required: true, message: 'Please enter the description' }]}
                >
                    <Input.TextArea rows={4} placeholder="Enter ticket description" />
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
