import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import {
    AppstoreOutlined,
    UserOutlined,
    MailOutlined,
    DollarOutlined,
} from '@ant-design/icons';
import '../styles/components/Navbar.css';

const ServiceTechNavbar = () => {
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState(location.pathname);

    const getMenuKey = () => {
        const { pathname } = location;
        if (pathname === '/ticketsService') {
            return '/Tickets';
        }
        return pathname;
    };

    useEffect(() => {
        setSelectedKey(getMenuKey());
    }, [location]);

    const handleClick = (e) => {
        setSelectedKey(e.key);
    };

    // Define menu items using the "items" property
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
            key: '/ProfilePage',
            icon: <UserOutlined />,
            label: <Link to="/ProfilePage">My profile</Link>,
        },
    ];

    return (
        <div
            style={{
                background: 'linear-gradient(to left, #a1c4fd, #c2e9fb)',
                padding: '10px',
                marginTop: '10px',
                minHeight: '100vh',
            }}
        >
            <Menu
                mode="vertical"
                className="navbar"
                selectedKeys={[selectedKey]}
                onClick={handleClick}
                theme="light"
                style={{ border: 'none' }}
                items={menuItems} // Pass the items array here
            />
        </div>
    );
};

export default ServiceTechNavbar;
