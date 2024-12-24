// src/components/Auth/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { message } from 'antd';

const ProtectedRoute = ({ children, allowedRoles, allowedUserType }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user')); // Get user from local storage
        setUser(storedUser);
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return null; // or a loading spinner
    }

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
