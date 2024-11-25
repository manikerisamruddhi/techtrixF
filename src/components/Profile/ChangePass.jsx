import React from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { updateUser } from '../../redux/slices/userSlice';
import { useDispatch } from 'react-redux';

const ChangePassword = ({ visible, onClose, user }) => {
    const dispatch = useDispatch();

    const handleChangePassword = async ({ newPassword }) => {
        const userId = user.userId;

        const values = {
            ...user,
            password: newPassword,
        }
    
        try {
            // Dispatch the updateUser  action and wait for it to complete
            await dispatch(updateUser ({ userId, ...values })).unwrap();

            // Show success message
            message.success('Password updated successfully!');
        } catch (error) {
            // Handle any errors that occurred during the update
            message.error('Failed to update password. Please try again.');
        } finally {
            // Close the modal regardless of success or failure
            onClose();
        }
    };

    return (
        <Modal
            title="Change Password"
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form
                layout="vertical"
                onFinish={handleChangePassword}
            >
                <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[{ required: true, message: 'Please enter your new password' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Please confirm your password' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                    Change Password
                </Button>
            </Form>
        </Modal>
    );
};

export default ChangePassword;
