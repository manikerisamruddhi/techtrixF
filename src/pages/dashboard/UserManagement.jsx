import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Card, Typography, Button, Table } from 'antd';
import { fetchUsers } from '../../redux/slices/userSlice';

const { Content } = Layout;
const { Title } = Typography;

const UserManagement = () => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.users); // Change to reflect user data
    const status = useSelector((state) => state.users.status);
    const error = useSelector((state) => state.users.error);

    // Fetch users when component mounts
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchUsers());
        }
    }, [status, dispatch]);

    const columns = [
        {
            title: 'User ID',
            dataIndex: 'userid',
            key: 'userid',
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            key: 'first_name',
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
            key: 'last_name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (isActive) => (isActive ? 'Active' : 'Inactive'),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh', background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)' }}>

            <Content style={{ padding: '20px' }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}
                >
                    {/* User Management Title */}
                    <Title level={4} style={{ margin: 0 }}>
                        User Management
                    </Title>

                    {/* Create User Button */}
                    <Button type="primary">Create User</Button>
                </div>
                <Card bordered={false}>

                    {/* Display user data in a table */}
                    <Table
                        dataSource={users}
                        columns={columns}
                        rowKey="userid"
                        pagination={false}
                    />
                    {/* Display error message if any */}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </Card>
            </Content>
        </Layout>
    );
};

export default UserManagement;
