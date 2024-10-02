import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined, SnippetsOutlined, DollarOutlined, DropboxOutlined } from '@ant-design/icons';
import '../../styles/components/Navbar.css';

const Navbar2 = () => {
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState(location.pathname);

    const handleClick = (e) => {
        setSelectedKey(e.key);
    };

    return (
        <div 
            style={{ 
                background: 'linear-gradient(to left, #a1c4fd, #c2e9fb)', 
                padding: '10px',
                marginTop: '10px',
                minHeight: '100vh' // Ensures full vertical height
            }}
        >
            <Menu 
                mode="vertical" 
                className="navbar" 
                selectedKeys={[selectedKey]} 
                onClick={handleClick} 
                theme="light"
                style={{ border: 'none' }} // Remove default border for a cleaner look
            >
                <Menu.Item key="/" icon={<AppstoreOutlined />}>
                    <Link to="/Sales">Home</Link>
                </Menu.Item>

                {/* userid for jone doe */}
                <Menu.Item key="/TicketList" icon={<MailOutlined />}>
                    <Link to="/Sales-Tickets/1001">Tickets</Link>  
                </Menu.Item>

                <Menu.Item key="/Quotations" icon={<DollarOutlined />}>
                    <Link to="/Sales-Quotations">Quotations</Link>
                </Menu.Item>

                <Menu.Item key="/Invoices" icon={<SnippetsOutlined />}>
                    <Link to="/Sales-Invoices">Invoices</Link>
                </Menu.Item>

                <Menu.Item key="/Products" icon={<DropboxOutlined />}>
                    <Link to="/Sales-Products">Products</Link>
                </Menu.Item>

            </Menu>
        </div>
    );
};

export default Navbar2;
