import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './Auth.css'; // Import CSS for UI styling

const LoginPage = () => {
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            await login(credentials);
            navigate('/dashboard');  // Redirect to dashboard on success
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div class="auth-wrapper">
        <div className="auth-container">
            <h2>Login</h2>
            {error && <p className="auth-error">{error}</p>}
            <form onSubmit={handleLogin}>
                <div className="auth-field">
                    <label>Email</label>
                    <input
                        type="email"
                        value={credentials.email}
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        required
                    />
                </div>
                <div className="auth-field">
                    <label>Password</label>
                    <input
                        type="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" className="auth-button">Login</button>
            </form>
            <div className="auth-links">
                <a href="/register">Register</a> | <a href="/forgot-password">Forgot Password?</a>
            </div>
        </div>
        </div>
    );
};

export default LoginPage;
