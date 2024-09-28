import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import '../../styles/components/AdminNav.css';

const Navbar = () => {
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState(location.pathname);

    const handleClick = (e) => {
        setSelectedKey(e.key);
    };

    return (
        <Menu 
            mode="vertical" 
            className="navbar" 
            selectedKeys={[selectedKey]} 
            onClick={handleClick} 
            theme="light"
        >
            <Menu.Item key="/" icon={<AppstoreOutlined />}>
                <Link to="/">Home</Link>
            </Menu.Item>

            <Menu.Item key="/TicketList" icon={<MailOutlined />}>
                <Link to="/TicketList">Tickets</Link>
            </Menu.Item>

            <Menu.Item key="/Open">
                <Link to="/Open">Open</Link>
            </Menu.Item>
            <Menu.Item key="/InProgress">
                <Link to="/InProgress">In Progress</Link>
            </Menu.Item>
            <Menu.Item key="/Resolved">
                <Link to="/Resolved">Resolved</Link>
            </Menu.Item>

            <Menu.Item key="/Quotations" icon={<SettingOutlined />}>
                <Link to="/Quotations">Quotations</Link>
            </Menu.Item>

            <Menu.Item key="/Invoices" icon={<SettingOutlined />}>
                <Link to="/Invoices">Invoices</Link>
            </Menu.Item>

            <Menu.Item key="/Subscribers" icon={<SettingOutlined />}>
                <Link to="/Subscribers">Subscribers</Link>
            </Menu.Item>

            <Menu.Item key="/UserManagement" icon={<SettingOutlined />}>
                <Link to="/User Management">User Management</Link>
            </Menu.Item>
        </Menu>
    );
};

export default Navbar;
