// src/components/Header/Header.js
import React from 'react';
import { Layout, Typography, Space, Badge } from 'antd';
import { BellOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

const CustomHeader = () => {
    return (
        <Header style={{ 
            background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
            padding: '0 16px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            position: 'fixed', 
            width: '100%', 
            zIndex: 10 // Ensure header stays above all other content
        }}>
            <Text strong style={{ fontSize: '18px' }}>
                Techtrix
            </Text>
            <Space>
                <Badge count={5} overflowCount={99}>
                    <BellOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
                </Badge>
            </Space>
        </Header>
    );
};

export default CustomHeader;
