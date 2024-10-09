// CustomerForm.js

import React from 'react';
import { Form, Input, Row, Col } from 'antd';

const CustomerForm = ({ newCustomer, setNewCustomer }) => {
    return (
        <div style={{ border: '1px solid #d9d9d9', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h4>New Customer Details</h4>
            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item
                        label="Name"
                        rules={[{ required: true, message: 'Please enter customer name' }]}
                    >
                        <Input
                            value={newCustomer.name}
                            onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="Email"
                        rules={[{ required: true, message: 'Please enter customer email' }]}
                    >
                        <Input
                            type="email"
                            value={newCustomer.email}
                            onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="Phone"
                        rules={[{ required: true, message: 'Please enter customer phone number' }]}
                    >
                        <Input
                            value={newCustomer.phone}
                            onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Address"
                        rules={[{ required: true, message: 'Please enter customer address' }]}
                    >
                        <Input
                            value={newCustomer.address}
                            onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })}
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="City"
                        rules={[{ required: true, message: 'Please enter customer city' }]}
                    >
                        <Input
                            value={newCustomer.city}
                            onChange={e => setNewCustomer({ ...newCustomer, city: e.target.value })}
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="State"
                        rules={[{ required: true, message: 'Please enter customer state' }]}
                    >
                        <Input
                            value={newCustomer.state}
                            onChange={e => setNewCustomer({ ...newCustomer, state: e.target.value })}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item
                        label="Zip Code"
                        rules={[{ required: true, message: 'Please enter customer zip code' }]}
                    >
                        <Input
                            value={newCustomer.zipCode}
                            onChange={e => setNewCustomer({ ...newCustomer, zipCode: e.target.value })}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="Country Code"
                        rules={[{ required: true, message: 'Please enter customer country code' }]}
                    >
                        <Input
                            value={newCustomer.countryCode}
                            onChange={e => setNewCustomer({ ...newCustomer, countryCode: e.target.value })}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="Premium Status"
                    >
                        <Input
                            type="checkbox"
                            checked={newCustomer.isPremium}
                            onChange={e => setNewCustomer({ ...newCustomer, isPremium: e.target.checked })}
                        />
                        <span style={{ marginLeft: '8px' }}>Is Premium Customer</span>
                    </Form.Item>
                </Col>
            </Row>
        </div>
    );
};

export default CustomerForm;
