import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Alert, message } from 'antd';
import { useDispatch } from 'react-redux';  // Import useDispatch
import { loginUser } from '../../redux/slices/loginSlice';  // Import loginUser thunk

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Add a loading state
    const dispatch = useDispatch();  // Initialize dispatch
    const navigate = useNavigate();

    const handleLogin = async (values) => {
        setLoading(true); // Activate loader
        try {
            const resultAction = await dispatch(loginUser(values));
            if (loginUser.fulfilled.match(resultAction)) {
                const userRole = resultAction.payload.role;
                if (userRole === 'Admin') {
                    navigate('/');  // Redirect to Admin
                } else if (userRole === 'Sales') {
                    navigate('/');  // Redirect to Sales
                } else if (userRole === 'Service_Technical') {
                    navigate('/');  // Redirect to ServiceTech
                } else {
                    message.error('You are not authorized to log in.', 3);  // Default redirect to home page
                }
            } else {
                setError(resultAction.payload);
            }
        } catch (err) {
            setError('Error: ' + err);
        } finally {
            setLoading(false); // Deactivate loader
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
                    label="email"
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
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="auth-button"
                        block
                        loading={loading} // Bind the loading state to the button
                    >
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default LoginPage;
