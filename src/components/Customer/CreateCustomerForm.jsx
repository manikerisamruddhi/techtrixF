import React, { useState } from 'react';
import { Form, Row, Col, Input, Switch } from 'antd';

const CreateCustomerForm = ({ customer, setCustomer }) => {
    const [newCustomer, setNewCustomer] = useState(customer);

    const handleInputChange = (e) => {
        setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
        setCustomer({ ...newCustomer, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ border: '1px solid #d9d9d9', padding: '10px', borderRadius: '8px', backgroundColor: '#f9f9f9', marginBottom: '10px' }}>
            <h4>New Customer Details</h4>
            <Row gutter={20}>
                <Col span={7}>
                    <Form.Item label="First Name" rules={[{ required: true, message: 'Please enter customer first name' }]}>
                        <Input value={newCustomer.firstName} onChange={handleInputChange} name="firstName" />
                    </Form.Item>
                </Col>
                <Col span={7}>
                    <Form.Item label="Last Name" rules={[{ required: true, message: 'Please enter customer last name' }]}>
                        <Input value={newCustomer.lastName} onChange={handleInputChange} name="lastName" />
                    </Form.Item>
                </Col>
                <Col span={7}>
                    <Form.Item label="email" rules={[{ required: true, message: 'Please enter customer email' }]}>
                        <Input type="email" value={newCustomer.email} onChange={handleInputChange} name="email" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Phone" rules={[{ required: true, message: 'Please enter customer phone number' }]}>
                        <Input value={newCustomer.phoneNumber} onChange={handleInputChange} name="phoneNumber" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="address">
                        <Input value={newCustomer.address} onChange={handleInputChange} name="address" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Pin Code">
                        <Input value={newCustomer.pinCode} onChange={handleInputChange} name="pinCode" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Is Premium">
                        <Switch checked={newCustomer.isPremium} onChange={(e) => setNewCustomer({ ...newCustomer, isPremium: e })} />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    );
};

export default CreateCustomerForm;