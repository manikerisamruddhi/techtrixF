import React, { useEffect, useState } from 'react';
import { Table, Button, Empty, message, Form, Input, Select, Layout, Typography, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets, createTicket } from '../../redux/slices/ticketSlice';
import { fetchUsers, fetchDepartments } from '../../redux/slices/userSlice';
import useToggle from '../../hooks/useCreateTicket';
import TicketDetailsModal from './TicketDetailsModal'; // Import the new modal component

const { Option } = Select;
const { Content } = Layout;
const { Title } = Typography;

const Tickets = () => {
    const dispatch = useDispatch();
    const { tickets, loading: ticketsLoading, error: ticketsError } = useSelector((state) => state.tickets);
    const { users, loading: usersLoading, error: usersError, departments, loading: departmentsLoading, error: departmentsError } = useSelector((state) => state.users);

    const [isFormVisible, toggleForm] = useToggle(false);
    const [form] = Form.useForm();
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchTickets());
            await dispatch(fetchDepartments());
            await dispatch(fetchUsers());
        };
        fetchData();
    }, [dispatch]);

    // Handle backend error
    if (ticketsError || usersError || departmentsError) {
        message.error(`Failed to load data: ${ticketsError || usersError || departmentsError}. Please check backend connectivity.`);
    }

    // Filter users based on selected department
    useEffect(() => {
        if (selectedDepartment) {
            const usersInDepartment = users.filter(user => user.department === selectedDepartment);
            setFilteredUsers(usersInDepartment);
        } else {
            setFilteredUsers(users); // Reset to all users if no department is selected
        }
    }, [selectedDepartment, users]);

    const columns = [
        {
            title: 'Ticket ID',
            dataIndex: 'TicketID',
            key: 'TicketID',
        },
        {
            title: 'Title',
            dataIndex: 'Title',
            key: 'Title',
            render: (text, record) => (
                <Button type="link" onClick={() => showModal(record)}>
                    {text}
                </Button>
            ),
        },
        {
            title: 'Created By',
            dataIndex: 'CreatedBy',
            key: 'CreatedBy',
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
        },
        {
            title: 'Priority',
            dataIndex: 'Priority',
            key: 'Priority',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Button type="primary" onClick={() => showModal(record)}>
                    View
                </Button>
            ),
        },
    ];

    const showModal = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedTicket(null); // Clear selected ticket
    };

    const onFinish = async (values) => {
        const currentDate = new Date().toISOString();
        const modifiedValues = {
            ...values,
            TicketID: values.id || 6,
            Status: 'Open',
            CreatedBy: values.CreatedBy || 'Admin',
            CreatedDate: currentDate, 
        };
        console.log(modifiedValues);

        try {
            await dispatch(createTicket(modifiedValues));
            message.success('Ticket created successfully!');
            form.resetFields();
            toggleForm();
        } catch (error) {
            message.error(`Failed to create ticket: ${error.message}`);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)' }}>
            <Content style={{ padding: '20px' }}>
                <div className="content-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <Title level={4} style={{ margin: 0 }}>Ticket List</Title>
                        <Button onClick={toggleForm} className="create-ticket-btn" type="primary">
                            {isFormVisible ? 'Cancel' : 'Create Ticket'}
                        </Button>
                    </div>

                    {isFormVisible && (
                        <Form
                            layout="vertical"
                            onFinish={onFinish}
                            form={form}
                            className="create-ticket-form"
                            style={{ marginTop: '20px' }}
                        >
                            <Form.Item
                                name="Title"
                                label="Title"
                                rules={[{ required: true, message: 'Please enter the ticket title' }]}
                            >
                                <Input placeholder="Enter ticket title" />
                            </Form.Item>
                            <Form.Item
                                name="Description"
                                label="Description"
                                rules={[{ required: true, message: 'Please enter the description' }]}
                            >
                                <Input.TextArea rows={4} placeholder="Enter ticket description" />
                            </Form.Item>
                            <Form.Item
                                name="Priority"
                                label="Priority"
                                rules={[{ required: true, message: 'Please select priority' }]}
                            >
                                <Select placeholder="Select priority">
                                    <Option value="Low">Low</Option>
                                    <Option value="Medium">Medium</Option>
                                    <Option value="High">High</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="Department"
                                label="Department"
                                rules={[{ required: true, message: 'Please select a department' }]}
                            >
                                <Select
                                    placeholder="Select department"
                                    onChange={(value) => setSelectedDepartment(value)}
                                >
                                    {departmentsLoading ? (
                                        <Option disabled>Loading Departments...</Option>
                                    ) : departments && departments.length > 0 ? (
                                        departments.map(department => (
                                            <Option key={department.id} value={department.id}>
                                                {department.name}
                                            </Option>
                                        ))
                                    ) : (
                                        <Option disabled>No Departments Available</Option>
                                    )}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="AssignedToID"
                                label="Assign User"
                                rules={[{ required: true, message: 'Please select a user' }]}
                            >
                                <Select placeholder="Select user">
                                    {usersLoading ? (
                                        <Option disabled>Loading Users...</Option>
                                    ) : filteredUsers && filteredUsers.length > 0 ? (
                                        filteredUsers.map(user => (
                                            <Option key={user.userid} value={user.userid}>
                                                {`${user.first_name} ${user.last_name}`}
                                            </Option>
                                        ))
                                    ) : (
                                        <Option disabled>No Users Available</Option>
                                    )}
                                </Select>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={ticketsLoading}>
                                    Submit Ticket
                                </Button>
                            </Form.Item>
                        </Form>
                    )}

                    {ticketsLoading ? (
                        <Spin tip="Loading..." />
                    ) : tickets.length === 0 ? (
                        <Empty description="No Tickets Available" />
                    ) : (
                        <Table
                            dataSource={tickets}
                            columns={columns}
                            rowKey="TicketID"
                            pagination={false}
                        />
                    )}

                    {/* Ticket Details Modal */}
                    <TicketDetailsModal
                        visible={isModalVisible}
                        ticket={selectedTicket}
                        onClose={handleModalClose}
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default Tickets;
