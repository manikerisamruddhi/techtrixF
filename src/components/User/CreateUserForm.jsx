import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Switch, message, Row, Col } from 'antd';
import { useDispatch } from 'react-redux';
import { createUser, updateUser } from '../../redux/slices/userSlice';

const { Option } = Select;

const CreateUserForm = ({ user, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const isEditMode = Boolean(user); // Determine if it's edit mode

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                ...user,
                userType: user.userType === 'Admin_User', // Convert to boolean for the Switch
            });
        }
    }, [user, form]);

    const handleSubmit = async (values) => {
        try {
            const userData = {
                ...values,
                userType: values.userType ? 'Admin_User' : 'Normal_User', // Map boolean to enum
            };

            if (isEditMode) {
                await dispatch(updateUser({ ...userData, userId: user.userId }));
                message.success('User updated successfully!');
            } else {
                const result = await dispatch(createUser(userData));
                if (createUser.fulfilled.match(result)) {
                    message.success('User added successfully!');
                } else {
                    throw new Error(result.error.message || 'Failed to add user');
                }
            }

            form.resetFields();
            onClose(); // Close the modal after success
        } catch (error) {
            message.error(error.message || 'Failed to save user. Please try again later.');
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
                userType: false, // Default to Normal User
            }}
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
                        rules={[
                            { required: true, type: 'email', message: 'Please input a valid email!' },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Phone Number"
                        name="phoneNumber"
                        rules={[
                            { required: true, message: 'Please input the phone number!' },
                            { pattern: /^[0-9]{10}$/, message: 'Phone number must be 10 digits' },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please select a role!' }]}
                    >
                        <Select placeholder="Select a role">
                            <Option value="Logistics">Logistics</Option>
                            <Option value="Sales">Sales</Option>
                            <Option value="Service_Technical">Service technical</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="User Type"
                        name="userType"
                        valuePropName="checked" // Maps to boolean
                        rules={[{ required: true, message: 'Please select the user type!' }]}
                    >
                        <Switch
                            checkedChildren="Admin"
                            unCheckedChildren="Normal User"
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                {!isEditMode && (
                    <Col span={24}>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please enter the password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>
                )}
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
