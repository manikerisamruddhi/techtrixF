import React from 'react';
import { Modal, Form, Input, Button, Switch, message, Row, Col } from 'antd';
import { updateUser } from '../../redux/slices/userSlice';
import { useDispatch } from 'react-redux';

const UpdateProfile = ({ visible, onClose, user, onUpdate }) => {
    const [form] = Form.useForm(); // Ant Design form instance
    const dispatch = useDispatch();

    React.useEffect(() => {
        // Populate form with user data when modal is opened
        if (user) {
            form.setFieldsValue({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                address: user.address,
                zipCode: user.zipCode,
                role: user.role,
                isActive: user.isActive,
            });
        }
    }, [user, form]);

    const handleUpdateProfile = async (values) => {
        const userId = user.userId;
    
        try {
            // Dispatch the updateUser  action and wait for it to complete
            const updatedUser  = await dispatch(updateUser ({ userId, ...values })).unwrap();
            
            // Call onUpdate with the updated user data
            onUpdate(updatedUser );
    
            // Show success message
            message.success('Profile updated successfully!');
        } catch (error) {
            // Handle any errors that occurred during the update
            message.error('Failed to update profile use different email or try again later.');
        } finally {
            // Close the modal regardless of success or failure
            onClose();
        }
    };

    return (
        <Modal
            title="Update Profile"
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <Form
                form={form} // Bind form instance
                layout="vertical"
                onFinish={handleUpdateProfile}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="First Name"
                            name="firstName"
                            rules={[{ required: true, message: 'Please enter your first name' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Last Name"
                            name="lastName"
                            rules={[{ required: true, message: 'Please enter your last name' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="Email"
                            name="email"
                        >
                            <Input disabled/>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Phone Number"
                            name="phoneNumber"
                            rules={[
                                { required: true, message: 'Please enter your phone number' },
                                { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number' },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label="Role"
                            name="role"
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>

                </Row>

                <Row justify="end">
                    <Button type="primary" htmlType="submit">
                        Save Changes
                    </Button>
                </Row>
            </Form>
        </Modal>
    );
};

export default UpdateProfile;
