// src/components/Layout.js
import React, { useEffect, useState } from 'react';
import { Layout, Spin } from 'antd'; // Import Spin for loading indicator
import { useLocation } from 'react-router-dom';
import CustomHeader from './Header/Header'; // Updated header import
import Navbar from './Navbar/Navbar'; // Default Navbar component
import SalesNavbar from '../Sales/Component/Navbar';
import ServiceTechNavbar from '../ServiceTech/ServiceTechNavbar';

const { Content, Sider } = Layout;

const LayoutComponent = ({ children }) => {
    const location = useLocation();

    // Define routes where the sidebar should be hidden
    const hideSidebarRoutes = ['/login', '/forgot-password', '/register'];
    const isSidebarHidden = hideSidebarRoutes.includes(location.pathname);

    // Set up state to store the user's role and loading state
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        // Retrieve user data from localStorage and set the role
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role) {
            setUserRole(user.role);
        }
        setLoading(false); // Set loading to false after retrieving the user role
    }, []);

    // If loading, show a spinner
    if (loading) {
        return (
            <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" />
            </Layout>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Fixed Header with higher z-index */}
            <CustomHeader />
            <Layout style={{ marginTop: 64 }}> {/* Ensure content starts below the header */}
                {!isSidebarHidden && (
                    <Sider
                        width={200}
                        style={{ position: 'fixed', top: 64, left: 0, height: 'calc(100% - 64px)', background: '#fff', zIndex: 1 }}
                    >
                        {/* Conditionally render Navbar based on user role */}
                        {
                            userRole === 'Sales' ? (
                                <SalesNavbar />
                            ) : userRole === 'Service_Technical' ? (
                                <ServiceTechNavbar />
                            ) : userRole === 'Admin' ? (
                                <Navbar />
                            ) : (
                               null
                            )
                        }
                    </Sider>
                )}
                <Layout style={{ marginLeft: isSidebarHidden ? 0 : 200 }}>
                    <Content style={{ padding: '10px', background: '#fff', marginTop: 0 }}> {/* Reset marginTop to 0 */}
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default LayoutComponent;