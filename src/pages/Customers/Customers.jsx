import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, addCustomer, updateCustomer, deleteCustomer } from '../../redux/slices/customerSlice';
import { Button, Table, Modal, Form, Input, Layout, Typography, Empty, Spin, message } from 'antd';
import { toast } from 'react-toastify';

const { Content } = Layout;
const { Title } = Typography;

const Customers = () => {
    const dispatch = useDispatch();
    const { customers, loading, error } = useSelector((state) => state.customers);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [editCustomer, setEditCustomer] = React.useState(null);

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    // Handle backend error
    useEffect(() => {
        if (error) {
            message.error(`Failed to load customers: ${error}. Please check backend connectivity.`);
        }
    }, [error]);

    const handleAddOrEditCustomer = (values) => {
        if (editCustomer) {
            dispatch(updateCustomer({ customerId: editCustomer.CustomerID, updatedCustomer: values })).then(() => {
                toast.success('Customer updated successfully!');
                setEditCustomer(null);
            });
        } else {
            dispatch(addCustomer(values)).then(() => {
                toast.success('Customer added successfully!');
            });
        }
        setIsModalVisible(false);
    };

    const handleEdit = (customer) => {
        setEditCustomer(customer);
        setIsModalVisible(true);
    };

    const handleDelete = (customerId) => {
        dispatch(deleteCustomer(customerId)).then(() => {
            toast.success('Customer deleted successfully!');
        });
    };

    const columns = [
        { title: 'ID', dataIndex: 'CustomerID', key: 'CustomerID' },
        { title: 'First Name', dataIndex: 'FirstName', key: 'FirstName' },
        { title: 'Email', dataIndex: 'Email', key: 'Email' },
        { title: 'Phone', dataIndex: 'PhoneNumber', key: 'PhoneNumber' },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <>
                    <Button type="link" onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record.CustomerID)}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh', background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)' }}>
            <Content style={{ padding: '20px' }}>
                <div className="customers-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <Title level={4} style={{ margin: 0 }}>Customer List</Title>
                        <Button type="primary" onClick={() => setIsModalVisible(true)}>
                            Add Customer
                        </Button>
                    </div>

                    {loading ? (
                        <Spin tip="Loading..." />
                    ) : customers.length === 0 ? (
                        <Empty description="No Customers Available" />
                    ) : (
                        <Table
                            dataSource={customers}
                            columns={columns}
                            rowKey="CustomerID"
                            pagination={false}
                        />
                    )}

                    <Modal
                        title={editCustomer ? 'Edit Customer' : 'Add Customer'}
                        visible={isModalVisible}
                        onCancel={() => setIsModalVisible(false)}
                        footer={null}
                    >
                        <Form
                            initialValues={editCustomer}
                            onFinish={handleAddOrEditCustomer}
                        >
                            <Form.Item label="First Name" name="FirstName" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Email" name="Email" rules={[{ required: true, type: 'email' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Phone" name="PhoneNumber" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Button type="primary" htmlType="submit">
                                {editCustomer ? 'Update' : 'Add'}
                            </Button>
                        </Form>
                    </Modal>
                </div>
            </Content>
        </Layout>
    );
};

export default Customers;
