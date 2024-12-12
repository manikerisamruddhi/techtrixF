import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, addCustomer, updateCustomer, deleteCustomer } from '../../redux/slices/customerSlice';
import { Button, Table, Layout, Typography, Empty, Spin, message, Modal} from 'antd';
import { toast } from 'react-toastify';
import CustomerFormModal from '../../components/Customer/CustomerFormModal'; // Import the new form component

const { Content } = Layout;
const { Title } = Typography;

const Customers = () => {

    const user = JSON.parse(localStorage.getItem('user'));

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
            message.error(`not found`);
        }
    }, [error]);

    // const handleAddOrEditCustomer = (values) => {
    //     if (mode === 'edit') {
    //         dispatch(updateCustomer({ customerId: values.customerId, updatedCustomer: values }))
    //             .then(() => {
    //                 toast.success('Customer updated successfully!');
    //                 setEditCustomer(null);
    //                 dispatch(fetchCustomers());  // Fetch the updated customer list
    //             });
    //     } else {
    //         dispatch(addCustomer(values))
    //             .then(() => {
    //                 toast.success('Customer added successfully!');
    //                 dispatch(fetchCustomers());  // Fetch the updated customer list
    //             });
    //     }
    //     setIsModalVisible(false);
    // };

    const handleEdit = (customer) => {
        setEditCustomer(customer);
        setMode('edit'); // Set the mode to edit
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
                    dispatch(fetchCustomers()); // Refresh customer list
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
        ...(user.role === 'Admin'
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
            : [])
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
                            rowKey="customerId"
                            pagination={false}
                        />
                    )}

                    {/* Customer Form Modal */}
                    <CustomerFormModal
                        key={mode} // Add a key prop to the modal
                        visible={isModalVisible}
                        onCancel={() => setIsModalVisible(false)}
                        // onFinish={handleAddOrEditCustomer}
                        initialValues={editCustomer}
                        mode={mode} // Pass the mode (edit/add)
                        customerId={editCustomer?.customerId} // Pass customer ID when editing
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default Customers;
