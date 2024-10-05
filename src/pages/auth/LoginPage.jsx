import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Alert } from 'antd';
import useAuth from '../../hooks/useAuth';

const LoginPage = () => {
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (values) => {
        try {
            await login(values);  // Pass entire credentials object
            navigate('/dashboard'); // Redirect to dashboard on success
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="auth-container" style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>Login</h2>
            {error && <Alert message={error} type="error" showIcon closable />}
            <Form
                layout="vertical"
                onFinish={handleLogin}
                initialValues={credentials}
            >
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input
                        type="email"
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="auth-button" block>
                        Login
                    </Button>
                </Form.Item>
            </Form>
            <div className="auth-links" style={{ textAlign: 'center' }}>
                <a href="/register">Register</a> | <a href="/forgot-password">Forgot Password?</a>
            </div>
        </div>
    );
};

export default LoginPage;
