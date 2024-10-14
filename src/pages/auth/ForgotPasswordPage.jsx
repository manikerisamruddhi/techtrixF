import React, { useState } from 'react';
import './Auth.css';

const ForgotPasswordPage = () => {
    const [email, setemail] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleForgotPassword = async (event) => {
        event.preventDefault();
        try {
            // Implement forgot password logic here (e.g., call API)
            setMessage('Password reset link sent to your email');
            setError(null);
        } catch (err) {
            setError('Failed to send reset link');
            setMessage(null);
        }
    };

    return (
        <div class="auth-wrapper">
        <div className="auth-container">
            <h2>Forgot Password</h2>
            {message && <p className="auth-message">{message}</p>}
            {error && <p className="auth-error">{error}</p>}
            <form onSubmit={handleForgotPassword}>
                <div className="auth-field">
                    <label>email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="auth-button">Send Reset Link</button>
            </form>
            <div className="auth-links">
                <a href="/login">Back to Login</a>
            </div>
        </div>
        </div>
    );
};

export default ForgotPasswordPage;
