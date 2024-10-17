import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, Button, Row, Col, message } from 'antd';
import { useDispatch } from 'react-redux';
import { addCustomer, updateCustomer } from '../../redux/slices/customerSlice'; // Import your Redux actions
import { useNavigate } from 'react-router-dom';

const CustomerFormModal = ({ visible, onCancel, initialValues, mode, customerID, onAddCustomer }) => {
    const [form] = Form.useForm(); // Create form instance
    const dispatch = useDispatch(); // Get the dispatch function
    const navigate = useNavigate(); // Get the navigate function

    // Reset the form when the modal opens in "add" mode
    useEffect(() => {
        if (visible && mode === 'add') {
            form.resetFields(); // Reset all fields if it's in "add" mode
        } else if (visible && mode === 'edit') {
            form.setFieldsValue(initialValues); // Set the form fields to the initial values for editing
        }
    }, [visible, mode, initialValues, form]);

    const handleFormSubmit = (values) => {
        if (mode === 'edit') {
            // Update customer API call
            dispatch(updateCustomer({ customerId: customerID, updatedCustomer: values }))
            .then(() => {
                message.success('Customer updated successfully!'); 
                // Close the modal after successful update
                onCancel();
            });
        } else {
            // Add customer API call
            dispatch(addCustomer(values))
        .then((resultAction) => {
            if (addCustomer.fulfilled.match(resultAction)) {
                const newCustomer = resultAction.payload;  // Get the newly added customer from the action payload
                message.success('Customer added successfully!');
                onCancel();  // Close modal

                // Trigger the parent callback to inform about the new customer
                if (onAddCustomer) {
                    onAddCustomer(newCustomer);
                }
            } else {
                message.error('Failed to add customer.');
            }
            });
        }
    };

    return (
        <Modal
            title={mode === 'edit' ? 'Edit Customer' : 'Add Customer'}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={800} // Set the modal width
            centered // Center the modal vertically
        >
            <div style={{ border: '1px solid #d9d9d9', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                <Form
                    form={form} // Assign form instance
                    onFinish={handleFormSubmit}
                    style={{ maxWidth: '100%' }} // Make the form take the full width of the modal
                >
                    <Row gutter={24}> {/* Set gutter for spacing between columns */}
                        <Col span={12}> {/* First column */}
                            <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}> {/* Second column */}
                            <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Phone" name="phoneNumber" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Address" name="address">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Zip Code" name="zipCode">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Premium Customer" name="isPremium" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit">
                            {mode === 'edit' ? 'Update' : 'Add'}
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};

export default CustomerFormModal;