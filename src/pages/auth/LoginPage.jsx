import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, Form, Button, message } from 'antd';
import useAuth from '../../hooks/useAuth';

const { Option } = Select;

const LoginPage = () => {
    const { login } = useAuth();
    const [role, setRole] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!role) {
            setError('Please select your role!');
            return;
        }

        try {
            // Pass only the role to the login function
            await login(role);

            // Navigate based on the role
            switch (role) {
                case 'admin':
                    navigate('/admin-dashboard');
                    break;
                case 'employee':
                    navigate('/employee-dashboard');
                    break;
                case 'manager':
                    navigate('/manager-dashboard');
                    break;
                default:
                    message.error('Invalid role selected');
            }
        } catch (err) {
            setError('Login failed');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <h2>Login</h2>
                {error && <p className="auth-error">{error}</p>}
                <Form
                    onFinish={handleLogin}
                    layout="vertical"
                >
                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please select your role!' }]}
                    >
                        <Select
                            placeholder="Select your role"
                            onChange={(value) => setRole(value)}
                        >
                            <Option value="admin">Admin</Option>
                            <Option value="employee">Sales</Option>
                            <Option value="manager">Logestick</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="auth-button">
                            Login
                        </Button>
                    </Form.Item>
                </Form>
                <div className="auth-links">
                    <a href="/register">Register</a> | <a href="/forgot-password">Forgot Password?</a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
