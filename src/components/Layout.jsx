// src/components/Layout.js
import React, { useEffect, useState } from 'react';
import { Layout, Spin } from 'antd'; // Import Spin for loading indicator
import { useLocation } from 'react-router-dom';
import CustomHeader from './Header/Header'; // Updated header import
import Navbar from './Navbar/Navbar'; // Default Navbar component
import SalesNavbar from '../Sales/Component/Navbar';
import ServiceTechNavbar from '../ServiceTech/ServiceTechNavbar';
import AdminNavbar from '../pages/Admin/AdminNavbar';

const { Content, Sider } = Layout;

const LayoutComponent = ({ children }) => {
    const location = useLocation();

    // Define routes where the sidebar should be hidden
    const hideSidebarRoutes = ['/login', '/forgot-password', '/register'];
    const isSidebarHidden = hideSidebarRoutes.includes(location.pathname);

    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user.role);

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
                            user ? (
                               user.userType && user.userType !== 'Admin_User' ? (
                                    user.role === 'Sales' ? (
                                        <SalesNavbar />
                                    ) : user.role === 'Service_Technical' ? (
                                        <ServiceTechNavbar />
                                    ) : null
                                ) : user.role === 'Admin' ? (
                                    <Navbar />
                                ) : (
                                    <AdminNavbar />
                                )
                            ) : null
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