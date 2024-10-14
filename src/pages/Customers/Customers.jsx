import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, addCustomer, updateCustomer, deleteCustomer } from '../../redux/slices/customerSlice';
import { Button, Table, Layout, Typography, Empty, Spin, message } from 'antd';
import { toast } from 'react-toastify';
import CustomerFormModal from '../../components/Customer/CustomerFormModel'; // Import the new form component

const { Content } = Layout;
const { title } = Typography;

const Customers = () => {
    const dispatch = useDispatch();
    const { customers, loading, error } = useSelector((state) => state.customers);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [editCustomer, setEditCustomer] = React.useState(null);
    const [mode, setMode] = React.useState('add'); // New state to track add/edit mode

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
        if (mode === 'edit') {
            dispatch(updateCustomer({ customerID: values.customerID, updatedCustomer: values }))
                .then(() => {
                    toast.success('Customer updated successfully!');
                    setEditCustomer(null);
                    dispatch(fetchCustomers());  // Fetch the updated customer list
                });
        } else {
            dispatch(addCustomer(values))
                .then(() => {
                    toast.success('Customer added successfully!');
                    dispatch(fetchCustomers());  // Fetch the updated customer list
                });
        }
        setIsModalVisible(false);
    };

    const handleEdit = (customer) => {
        setEditCustomer(customer);
        setMode('edit'); // Set the mode to edit
        setIsModalVisible(true);
    };

    const handleDelete = (customerID) => {
        dispatch(deleteCustomer(customerID)).then(() => {
            toast.success('Customer deleted successfully!');
        });
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'customerID' },
        { title: 'First Name', dataIndex: 'FirstName', key: 'FirstName' },
        { title: 'Last Name', dataIndex: 'LastName', key: 'LastName' },
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
                    <Button type="link" danger onClick={() => handleDelete(record.customerID)}>
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
                        <title level={4} style={{ margin: 0 }}>Customer List</title>
                        <Button
                            type="primary"
                            onClick={() => {
                                setIsModalVisible(true);
                                setEditCustomer(null);
                                setMode('add'); // Set the mode to add
                            }}
                        >
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
                            rowKey="customerID"
                            pagination={false}
                        />
                    )}

                    {/* Customer Form Modal */}
                    <CustomerFormModal
                        key={mode} // Add a key prop to the modal
                        visible={isModalVisible}
                        onCancel={() => setIsModalVisible(false)}
                        onFinish={handleAddOrEditCustomer}
                        initialValues={editCustomer}
                        mode={mode} // Pass the mode (edit/add)
                        customerID={editCustomer?.id} // Pass customer ID when editing
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default Customers;
