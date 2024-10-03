import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createTicket } from '../../redux/slices/ticketSlice';
import { fetchCustomers } from '../../redux/slices/customerSlice'; // Import customer slice

const { Option } = Select;

const CreateTicketModalForm = ({ visible, onClose, departments, filteredUsers, usersLoading, departmentsLoading }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const { customers, loading: customersLoading } = useSelector((state) => state.customers);

    useEffect(() => {
        if (visible) {
            dispatch(fetchCustomers()); // Fetch customers when modal is visible
        }
    }, [dispatch, visible]);

    const onFinish = async (values) => {
        const currentDate = new Date().toISOString();
        const modifiedValues = {
            ...values,
            TicketID: values.id || 6, // Assigning default ID for now
            Status: 'Open',
            CreatedBy: values.CreatedBy || 'Admin',
            CreatedDate: currentDate,
        };

        try {
            await dispatch(createTicket(modifiedValues));
            message.success('Ticket created successfully!');
            form.resetFields();
            onClose(); // Close modal on successful submission
        } catch (error) {
            message.error(`Failed to create ticket: ${error.message}`);
        }
    };

    return (
        <Modal
            visible={visible}
            title="Create Ticket"
            onCancel={onClose}
            footer={null} // Hide default footer for custom form submission button
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

                {/* New Customer Selection Field */}
                <Form.Item
                    name="CustomerID"
                    label="Customer"
                    rules={[{ required: true, message: 'Please select a customer' }]}
                >
                    <Select
    showSearch
    placeholder="Select a customer"
    loading={customersLoading}
    optionFilterProp="children"
    filterOption={(input, option) =>
        option?.value.toLowerCase().includes(input.toLowerCase())
    }
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
