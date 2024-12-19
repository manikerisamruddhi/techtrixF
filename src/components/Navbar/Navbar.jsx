import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import {
    AppstoreOutlined,
    UserOutlined,
    ProfileOutlined,
    MailOutlined,
    SettingOutlined,
    SnippetsOutlined,
    DollarOutlined,
    TeamOutlined,
    DropboxOutlined,
} from '@ant-design/icons';
import '../../styles/components/Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState(location.pathname);

    const menuItems = [
        {
            key: '/',
            icon: <AppstoreOutlined />,
            label: <Link to="/">Home</Link>,
        },
        {
            key: '/Tickets',
            icon: <MailOutlined />,
            label: <Link to="/Tickets">Tickets</Link>,
        },
        {
            key: '/Quotations',
            icon: <DollarOutlined />,
            label: <Link to="/Quotations">Quotations</Link>,
        },
        {
            key: '/Invoices',
            icon: <SnippetsOutlined />,
            label: <Link to="/Invoices">Invoices</Link>,
        },
        {
            key: '/Customers',
            icon: <SettingOutlined />,
            label: <Link to="/Customers">Customers</Link>,
        },
        {
            key: '/UserManagement',
            icon: <TeamOutlined />,
            label: <Link to="/UserManagement">Manage User</Link>,
        },
        {
            key: '/Products',
            icon: <DropboxOutlined />,
            label: <Link to="/Products">Products</Link>,
        },
        {
            key: '/ProfilePage',
            icon: <UserOutlined />,
            label: <Link to="/ProfilePage">My Profile</Link>,
        },
    ];

    const getMenuKey = () => {
        const { pathname } = location;
        if (pathname === '/tickets') {
            return '/Tickets';
        }
        return pathname; // Default to the pathname
    };

    useEffect(() => {
        setSelectedKey(getMenuKey());
    }, [location]);

    const handleClick = (e) => {
        setSelectedKey(e.key);
    };

    return (
        <div
            style={{
                background: 'linear-gradient(to left, #a1c4fd, #c2e9fb)',
                padding: '10px',
                marginTop: '10px',
                minHeight: '100vh', // Ensures full vertical height
            }}
        >
            <Menu
                mode="vertical"
                className="navbar"
                selectedKeys={[selectedKey]}
                onClick={handleClick}
                theme="light"
                style={{ border: 'none' }} // Remove default border for a cleaner look
                items={menuItems} // Pass the items array
            />
        </div>
    );
};

export default Navbar;
