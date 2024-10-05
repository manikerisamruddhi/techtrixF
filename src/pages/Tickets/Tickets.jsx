import React, { useEffect, useState } from 'react';
import { Table, Button, Empty, message, Layout, Typography, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets } from '../../redux/slices/ticketSlice';
import { fetchUsers, fetchDepartments } from '../../redux/slices/userSlice';
import TicketDetailsModal from './TicketDetailsModal';
import CreateTicketModal from '../../components/Ticket/CreateTicketModalForm'; // Import the CreateTicketModal

const { Content } = Layout;
const { Title } = Typography;

const Tickets = () => {
    const dispatch = useDispatch();
    const { tickets, loading: ticketsLoading, error: ticketsError } = useSelector((state) => state.tickets);
    const { users, loading: usersLoading, error: usersError, departments, loading: departmentsLoading, error: departmentsError } = useSelector((state) => state.users);

    const [isFormVisible, toggleForm] = useState(false); // Using state directly for modal
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
            dataIndex: 'id',
            key: 'id',
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

    return (
        <Layout style={{ minHeight: '100vh', background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)' }}>
            <Content style={{ padding: '20px' }}>
                <div className="content-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <Title level={4} style={{ margin: 0 }}>Ticket List</Title>
                        <Button onClick={() => toggleForm(!isFormVisible)} className="create-ticket-btn" type="primary">
                            {isFormVisible ? 'Cancel' : 'Create Ticket'}
                        </Button>
                    </div>

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

                    {/* Create Ticket Modal */}
                    <CreateTicketModal
                        visible={isFormVisible}
                        onClose={() => toggleForm(false)}
                        departments={departments}
                        filteredUsers={filteredUsers}
                        usersLoading={usersLoading}
                        departmentsLoading={departmentsLoading}
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default Tickets;
