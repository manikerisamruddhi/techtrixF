// src/components/Auth/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { message } from 'antd';

const ProtectedRoute = ({ children, allowedRoles, allowedUserType }) => {
    const user = JSON.parse(localStorage.getItem('user')); // Get user from local storage
//    console.log(user.role);
    // Check if the user is authenticated
    if (!user) {
        message.warning("You need to be logged in to view this page. Please log in first.");
        return <Navigate to="/login" replace />;
    }

    if (user.userType && allowedUserType && !allowedUserType.includes(user.userType)) {
        message.warning("You do not have permission to view this page.");
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        message.warning("You do not have permission to view this page.");
        return <Navigate to="/login" replace />;
    }

    return children; // Render the child components (protected content)
};

export default ProtectedRoute;
