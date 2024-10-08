import React, { useEffect, useState } from 'react';
import { Table, Button, Empty, message, Layout, Typography, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets } from '../../redux/slices/ticketSlice';
import { fetchUsers, fetchDepartments } from '../../redux/slices/userSlice';
import TicketDetailsModal from './TicketDetailsModal';
import CreateTicketModal from '../../components/Ticket/CreateTicketModalForm'; // Import the CreateTicketModal
import moment from 'moment'; // Import moment.js for date formatting

const { Content } = Layout;
const { Title } = Typography;

const Tickets = () => {
    const dispatch = useDispatch();
    const { tickets, loading: tickets_loading, error: tickets_error } = useSelector((state) => state.tickets);
    const { users, loading: users_loading, error: users_error, departments, loading: departments_loading, error: departments_error } = useSelector((state) => state.users);

    const [is_form_visible, toggle_form] = useState(false); // Using state directly for modal
    const [selected_department, set_selected_department] = useState(null);
    const [filtered_users, set_filtered_users] = useState([]);
    const [is_modal_visible, set_is_modal_visible] = useState(false);
    const [selected_ticket, set_selected_ticket] = useState(null);

    useEffect(() => {
        const fetch_data = async () => {
            await dispatch(fetchTickets());
            await dispatch(fetchDepartments());
            await dispatch(fetchUsers());
        };
        fetch_data();
    }, [dispatch]);

    // Handle backend error
    if (tickets_error || users_error || departments_error) {
        message.error(`Failed to load data: ${tickets_error || users_error || departments_error}. Please check backend connectivity.`);
    }

    // Filter users based on selected department
    useEffect(() => {
        if (selected_department) {
            const users_in_department = users.filter(user => user.department === selected_department);
            set_filtered_users(users_in_department);
        } else {
            set_filtered_users(users); // Reset to all users if no department is selected
        }
    }, [selected_department, users]);

    // Generate unique filter options for each column
    const get_unique_filters = (data, key) => {
        const unique_items = [...new Set(data.map(item => item[key]))];
        return unique_items.map(item => ({
            text: item,
            value: item
        }));
    };

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
                <Button type="link" onClick={() => show_modal(record)}>
                    {text}
                </Button>
            ),
        },
        {
            title: 'Created By',
            dataIndex: 'CreatedBy',
            key: 'CreatedBy',
            filters: get_unique_filters(tickets, 'CreatedBy'),
            onFilter: (value, record) => record.CreatedBy === value,
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
            filters: get_unique_filters(tickets, 'Status'),
            onFilter: (value, record) => record.Status === value,
        },
        {
            title: 'Priority',
            dataIndex: 'Priority',
            key: 'Priority',
            filters: get_unique_filters(tickets, 'Priority'),
            onFilter: (value, record) => record.Priority === value,
        },
        {
            title: 'Date Created',
            dataIndex: 'CreatedDate',
            key: 'CreatedDate',
            // Sort tickets by date created
            sorter: (a, b) => moment(b.CreatedDate).unix() - moment(a.CreatedDate).unix(),
            defaultSortOrder: 'descend', // Default to descending order
            render: (date) => moment(date).format('YYYY-MM-DD'), // Format date for display
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Button type="primary" onClick={() => show_modal(record)}>
                    View
                </Button>
            ),
        },
    ];

    const show_modal = (ticket) => {
        set_selected_ticket(ticket);
        set_is_modal_visible(true);
    };

    const handle_modal_close = () => {
        set_is_modal_visible(false);
        set_selected_ticket(null); // Clear selected ticket
    };

    return (
        <Layout style={{ minHeight: '100vh', background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)' }}>
            <Content style={{ padding: '20px' }}>
                <div className="content-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <Title level={4} style={{ margin: 0 }}>Ticket List</Title>
                        <Button onClick={() => toggle_form(!is_form_visible)} className="create-ticket-btn" type="primary">
                            {is_form_visible ? 'Cancel' : 'Create Ticket'}
                        </Button>
                    </div>

                    {tickets_loading ? (
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
                        visible={is_modal_visible}
                        ticket={selected_ticket}
                        onClose={handle_modal_close}
                    />

                    {/* Create Ticket Modal */}
                    <CreateTicketModal
                        visible={is_form_visible}
                        onClose={() => toggle_form(false)}
                        departments={departments}
                        filteredUsers={filtered_users}
                        usersLoading={users_loading}
                        departmentsLoading={departments_loading}
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default Tickets;
