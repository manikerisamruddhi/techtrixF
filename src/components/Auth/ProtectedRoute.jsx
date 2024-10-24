// src/components/Auth/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { message } from 'antd';

const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user')); // Get user from local storage
   
    // Check if the user is authenticated
    if (!user) {
        message.warning("You need to be logged in to view this page. Please log in first.");
        return <Navigate to="/login" replace />;
    }

    return children; // Render the child components (protected content)
};

export default ProtectedRoute;
