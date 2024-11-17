import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Card, Typography, Button, Table } from 'antd';
import { fetchUsers } from '../../redux/slices/userSlice';

const { Content } = Layout;
const { Title } = Typography;

const UserManagement = () => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.users);
    const status = useSelector((state) => state.users.status);
    const error = useSelector((state) => state.users.error);

    // Fetch users on mount or refresh
    useEffect(() => {
        dispatch(fetchUsers()); // Fetch data every time component mounts
    }, [dispatch]);

    const columns = [
        {
            title: 'User ID',
            dataIndex: 'userId',
            key: 'userid',
        },
        {
            title: 'Full Name',
            key: 'fullName',
            render: (record) => `${record.firstName} ${record.lastName}`,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phone_number',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
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
                        marginBottom: '20px',
                    }}
                >
                    <Title level={4} style={{ margin: 0 }}>
                        User Management
                    </Title>
                    <Button type="primary">Create User</Button>
                </div>
                <Card bordered={false}>
                    <Table
                        dataSource={users}
                        columns={columns}
                        rowKey="userId"
                        pagination={false}
                        loading={status === 'loading'}
                    />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </Card>
            </Content>
        </Layout>
    );
};

export default UserManagement;
