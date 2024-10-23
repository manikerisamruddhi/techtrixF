import React, { useState } from 'react';
import { Form, Row, Col, Input, Switch } from 'antd';

const CreateCustomerForm = ({ customer, setCustomer }) => {
    const [newCustomer, setNewCustomer] = useState(customer);

    const handleInputChange = (e) => {
        setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
        setCustomer({ ...newCustomer, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ border: '1px solid #d9d9d9', padding: '15px', borderRadius: '8px', backgroundColor: '#f9f9f9', marginBottom: '10px' }}>
            <h4>New Customer Details</h4>
            <Row gutter={24}> {/* Set gutter for spacing between columns */}
                <Col span={12}> {/* First column */}
                    <Form.Item label="Company name" name="companyName"
                    //  rules={[{ required: true }]}
                    >
                        <Input value={newCustomer.companyName} onChange={handleInputChange} name="companyName" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Address" name="address"
                        rules={[{ required: true }]}>
                        <Input value={newCustomer.address} onChange={handleInputChange} name="address" />
                    </Form.Item>
                </Col>
                <Col span={12}> {/* First column */}
                    <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
                        <Input value={newCustomer.firstName} onChange={handleInputChange} name="firstName" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Pin Code" name="zipCode">
                        <Input value={newCustomer.pinCode} onChange={handleInputChange} name="zipCode" 
                        rules={[
                            { required: true, message: 'Please input your zip code!' },
                            { pattern: /^[1-9][0-9]{5}$/, message: 'Pin code must be 6 digits and cannot start with 0.' },
                        ]}/>
                    </Form.Item>
                </Col>
                <Col span={12}> {/* Second column */}
                    <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
                        <Input value={newCustomer.lastName} onChange={handleInputChange} name="lastName" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                        <Input type="email" value={newCustomer.email} onChange={handleInputChange} name="email" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Phone" name="phoneNumber"
                        rules={[
                            { required: true, message: 'Please input your phone number!' },
                            { pattern: /^[0-9]{10}$/, message: 'Phone number must be 10 digits' },
                        ]}>
                        <Input value={newCustomer.phoneNumber} onChange={handleInputChange} name="phoneNumber" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item label="Premium Customer" name="isPremium" valuePropName="checked">
                        <Switch checked={newCustomer.isPremium} onChange={(e) => setNewCustomer({ ...newCustomer, isPremium: e })} />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    );
};

export default CreateCustomerForm;