// src/components/Auth/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { message } from 'antd';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useSelector((state) => state.users);

    console.log("User:", user);
    console.log("Is Authenticated:", isAuthenticated);
    

    // Check if the user is authenticated
    if (!isAuthenticated) {
        message.warning("You need to be logged in to view this page. Please log in first.");
        return <Navigate to="/login" replace />;

    }

    // Check if the user has the required role
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/login" replace />; // You can redirect to an unauthorized page or home
    }

    return children; // Render the child components (protected content)
};

export default ProtectedRoute;
