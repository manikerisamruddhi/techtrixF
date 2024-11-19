// CreateUserForm.js
import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Checkbox, message, Row, Col } from 'antd';
import { useDispatch } from 'react-redux';
import { createUser , updateUser  } from '../../redux/slices/userSlice';

const { Option } = Select;

const CreateUserForm = ({ user, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const isEditMode = Boolean(user); // Determine if it's edit mode

    useEffect(() => {
        if (user) {
            form.setFieldsValue(user); // Populate form with user data for editing
        }
    }, [user, form]);

    const handleSubmit = async (values) => {
        try {
            if (user) {
                await dispatch(updateUser ({ ...values, userId: user.userId })); // Update user
                message.success('User  updated successfully!');
            } else {
                await dispatch(createUser (values))
                .then((resultAction) => {
                    if (createUser.fulfilled.match(resultAction)) {
                        message.success('User added successfully!');
                        onClose();  // Close modal
                    } else {
                        message.error( error );
                    }
                    });
            }
            form.resetFields();
            onClose(); // Close the modal after successful creation or update
        } catch (error) {
            message.error('Failed to save user. Please try again later or try another Email.');
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[{ required: true, message: 'Please input the first name!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[{ required: true, message: 'Please input the last name!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Phone Number"
                        name="phoneNumber"
                        rules={[{ required: true, message: 'Please input the phone number!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Please input the address!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please select a role!' }]}
                    >
                        <Select placeholder="Select a role">
                            {/* <Option value="admin">Admin</Option> */}
                            <Option value="Logistics">Logistics </Option>
                            <Option value="Sales">Sales</Option>
                            <Option value="Service_Technical">Service technical</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Status"
                        name="isActive"
                        valuePropName="checked"
                    >
                        <Checkbox>Active</Checkbox>
                    </Form.Item>
                </Col>
                <Col span={12}>

                {!isEditMode && (
    <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter the password!' }]}>
        <Input.Password />
    </Form.Item>
)}

                </Col>
            </Row>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    {user ? 'Update User' : 'Create User'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateUserForm;