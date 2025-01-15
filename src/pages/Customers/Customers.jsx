import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, addCustomer, updateCustomer, deleteCustomer } from '../../redux/slices/customerSlice';
import { Button, Table, Layout, Typography, Empty, Spin, message, Modal, Input } from 'antd';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection
import CustomerFormModal from '../../components/Customer/CustomerFormModal';
import { SearchOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const Customers = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();  // Initialize the navigate hook

    const dispatch = useDispatch();
    const { customers, loading, error } = useSelector((state) => state.customers);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [editCustomer, setEditCustomer] = React.useState(null);
    const [mode, setMode] = React.useState('add');
    const [searchTerm, setSearchTerm] = useState('');
    const [retry, setRetry] = useState(false); // Add retry state

    // Redirect if user is not present
    useEffect(() => {
        if (!user) {
            navigate('/login');  // Redirect to login page
        }
    }, [user, navigate]);

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch, retry]); // Add retry to dependency array

    // Handle backend error
    useEffect(() => {
        if (error) {
            // message.error('Failed to load customers. Retrying...');
            setRetry((prevRetry) => !prevRetry); // Toggle retry state to re-call fetchCustomers
        }
    }, [error]);

    const filteredCustomers = customers.filter((customer) => {
        return (
            (customer.companyName && customer.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (customer.firstName && customer.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (customer.lastName && customer.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    const handleEdit = (customer) => {
        setEditCustomer(customer);
        setMode('edit');
        setIsModalVisible(true);
    };

    const handleDelete = (customerId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this customer?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => {
                dispatch(deleteCustomer(customerId)).then(() => {
                    toast.success('Customer deleted successfully!');
                    dispatch(fetchCustomers());
                });
            },
            onCancel: () => {
                toast.info('Customer deletion canceled.');
            },
        });
    };

    const columns = [
        { title: 'ID', dataIndex: 'cust_ID', key: 'cust_ID' },
        { title: 'Company name', dataIndex: 'companyName', key: 'companyName' },
        { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
        { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Phone', dataIndex: 'phoneNumber', key: 'phoneNumber' },
        ...(user?.role === 'Admin'
            ? [{
                title: 'Actions',
                key: 'actions',
                render: (record) => (
                    <>
                        <Button type="link" onClick={() => handleEdit(record)}>
                            Edit
                        </Button>
                        <Button type="link" danger onClick={() => handleDelete(record.customerId)}>
                            Delete
                        </Button>
                    </>
                ),
            }]
            : []),
    ];

    return (
        <Layout style={{ minHeight: '100vh', background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)' }}>
            <Content style={{ padding: '20px' }}>
                <div className="customers-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <Title level={4} style={{ margin: 0 }}>Customer List</Title>
                        <Button
                            type="primary"
                            onClick={() => {
                                setIsModalVisible(true);
                                setEditCustomer(null);
                                setMode('add');
                            }}
                        >
                            Add Customer
                        </Button>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        {/* Live Search Bar */}
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Search by company name, first name, last name, or email"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            style={{ width: 400 }}
                        />
                    </div>

                    {/* Customers Table */}
                    {loading === 'loading' && !error ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                            <Spin tip="Loading..." />
                            Loading...
                        </div>
                    ) : filteredCustomers.length === 0 ? (
                        <Empty description="No Customers Available" />
                    ) : (
                        <Table
                            dataSource={filteredCustomers}
                            columns={columns}
                            rowKey="customerId"
                            pagination={false}
                        />
                    )}

                    {/* Customer Form Modal */}
                    <CustomerFormModal
                        key={mode}
                        visible={isModalVisible}
                        onCancel={() => setIsModalVisible(false)}
                        initialValues={editCustomer}
                        mode={mode}
                        customerId={editCustomer?.customerId}
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default Customers;
