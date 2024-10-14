import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './Auth.css';

const RegisterPage = () => {
    const { register } = useAuth();
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();
        if (user.password !== user.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await register({ name: user.name, email: user.email, password: user.password });
            navigate('/dashboard');
        } catch (err) {
            setError('Registration failed');
        }
    };

    return (
        <div class="auth-wrapper">
        <div className="auth-container">
            <h2>Register</h2>
            {error && <p className="auth-error">{error}</p>}
            <form onSubmit={handleRegister}>
                <div className="auth-field">
                    <label>Name</label>
                    <input
                        type="text"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        required
                    />
                </div>
                <div className="auth-field">
                    <label>email</label>
                    <input
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        required
                    />
                </div>
                <div className="auth-field">
                    <label>Password</label>
                    <input
                        type="password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        required
                    />
                </div>
                <div className="auth-field">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={user.confirmPassword}
                        onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" className="auth-button">Register</button>
            </form>
            <div className="auth-links">
                <a href="/login">Already have an account? Login</a>
            </div>
        </div>
        </div>
    );
};

export default RegisterPage;
