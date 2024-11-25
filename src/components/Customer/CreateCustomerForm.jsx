import React, { useState } from 'react';
import { Form, Row, Col, Input, Switch, Button } from 'antd';

const CreateCustomerForm = ({ customer, setCustomer }) => {
    const [newCustomer, setNewCustomer] = useState(customer);
    const [form] = Form.useForm(); // Create a form instance

    const handleInputChange = (e) => {
        setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
        setCustomer({ ...newCustomer, [e.target.name]: e.target.value });
    };

    const onFinish = (values) => {
        console.log('Form values:', values);
        // You can handle the submit logic here
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div style={{ border: '1px solid #d9d9d9', padding: '15px', borderRadius: '8px', backgroundColor: '#f9f9f9', marginBottom: '10px' }}>
            <h4>New Customer Details</h4>
            <Form
                form={form}
                name="create_customer"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={newCustomer} // Prepopulate form with existing customer data
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item label="Company name" name="companyName">
                            <Input value={newCustomer.companyName} onChange={handleInputChange} name="companyName" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please input the address!' }]}>
                            <Input value={newCustomer.address} onChange={handleInputChange} name="address" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'First Name is required!' }]}>
                            <Input value={newCustomer.firstName} onChange={handleInputChange} name="firstName" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Pin Code"
                            name="zipCode"
                            rules={[
                                { required: true, message: 'Please input your pin code!' },
                                { pattern: /^[1-9][0-9]{5}$/, message: 'Pin code must be 6 digits and cannot start with 0.' },
                            ]}
                        >
                            <Input value={newCustomer.zipCode} onChange={handleInputChange} name="zipCode" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Last Name is required!' }]}>
                            <Input value={newCustomer.lastName} onChange={handleInputChange} name="lastName" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}>
                            <Input value={newCustomer.email} onChange={handleInputChange} name="email" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Phone"
                            name="phoneNumber"
                            rules={[
                                { required: true, message: 'Please input your phone number!' },
                                { pattern: /^[0-9]{10}$/, message: 'Phone number must be 10 digits' },
                            ]}
                        >
                            <Input value={newCustomer.phoneNumber} onChange={handleInputChange} name="phoneNumber" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Premium Customer" name="isPremium" valuePropName="checked">
                            <Switch checked={newCustomer.isPremium} onChange={(e) => setNewCustomer({ ...newCustomer, isPremium: e })} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default CreateCustomerForm;
