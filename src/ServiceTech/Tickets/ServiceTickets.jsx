import React, { useEffect, useState } from 'react';
import { Table, Button, Empty, message, Layout, Typography, Spin, Card, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchTicketByAssighnedToOrCreatedBy } from '../../redux/slices/ticketSlice';
import { fetchUsers } from '../../redux/slices/userSlice';
import { fetchCustomers } from '../../redux/slices/customerSlice';
import TicketDetailsModal from '../../components/Ticket/TicketDetailsModal';
import CreateTicketModal from '../../components/Ticket/CreateTicketModalForm'; // Import the CreateTicketModal
import moment from 'moment'; // Import moment.js for date formatting
import { useSearchParams } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

const TicketsService = () => {
    const dispatch = useDispatch();
    const { customers } = useSelector((state) => state.customers);
    const { tickets, loading: tickets_loading, error: tickets_error } = useSelector((state) => state.tickets);
    const { users, loading: users_loading, error: users_error, departments, loading: departments_loading, error: departments_error } = useSelector((state) => state.users);

    const [is_form_visible, toggle_form] = useState(false); // Using state directly for modal
    const [selected_department, set_selected_department] = useState(null);
    const [filtered_users, set_filtered_users] = useState([]);
    const [is_modal_visible, set_is_modal_visible] = useState(false);
    const [selected_ticket, set_selected_ticket] = useState(null);
    const [filtered_tickets, set_filtered_tickets] = useState([]); // State for filtered tickets
    const [Totalfiltered_tickets, set_Totalfiltered_tickets] = useState([]); // State for filtered tickets
    const [searchParams] = useSearchParams();
    const status = searchParams.get('status');

    const user = JSON.parse(localStorage.getItem('user')); // Get user from local storage
    const userId = user.userId;

    useEffect(() => {
        const fetch_data = async () => {
            await dispatch(fetchTicketByAssighnedToOrCreatedBy(userId));
            await dispatch(fetchUsers());
        };
        fetch_data();
    }, [dispatch, useLocation()]);

    const userFilteredTickets = tickets;

    useEffect(() => {
        const fetch_customers = async () => {
            await dispatch(fetchCustomers());
        };
        fetch_customers();
    }, [dispatch]);

    useEffect(() => {
        // Filter tickets based on user ID
        // const userFilteredTickets = tickets.filter(ticket =>
        //     ticket.createdById === user.userId || ticket.assignedTo === user.userId
        // );
        set_Totalfiltered_tickets(userFilteredTickets);

        // Further filter by status if applicable
        if (status) {
            const filtered = userFilteredTickets.filter(ticket => ticket.status === status);
            set_filtered_tickets(filtered);
        } else {
            set_filtered_tickets(userFilteredTickets); // Show all tickets for the user
        }
    }, [tickets, status, user.userId]);

    // Handle backend error
    if (tickets_error || users_error || departments_error) {
        message.error(`Failed to load data: Please check backend connectivity.`);
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

    // Calculate card data
    const total_tickets = Totalfiltered_tickets.length; // Use filtered tickets
    const open_tickets = Totalfiltered_tickets.filter(ticket => ticket.status === 'Open').length;
    const in_progress = Totalfiltered_tickets.filter(ticket => ticket.status === 'InProgress').length;
    const Closed_tickets = Totalfiltered_tickets.filter(ticket => ticket.status === 'Closed').length;

    // Filter tickets based on card click
    const handle_card_click = (status) => {
        // Filter tickets based on user roles (createdById or assignedTo)
        // const userFilteredTickets = tickets.filter(ticket =>
        //     ticket.createdById === user.userId || ticket.assignedTo === user.userId
        // );
    
        // If status is not 'Total', further filter by status
        const filtered = status !== 'Total' 
            ? userFilteredTickets.filter(ticket => ticket.status === status)
            : userFilteredTickets;
    
        // Set the filtered tickets
        set_filtered_tickets(filtered);
    };
    

    const columns = [
        {
            title: 'Ticket ID',
            dataIndex: 'ticketId',
            key: 'ticketId',
        },
        {
            title: 'Customer',
            dataIndex: 'customerId',
            key: 'customerId',
            render: (customerId, record) => {
                const customer = customers.find(customer => customer.customerId === customerId);
                return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer';
            },
            filters: customers.map(customer => ({
                text: `${customer.firstName} ${customer.lastName}`,
                value: customer.customerId,
            })),
            onFilter: (value, record) => record.customerId === value,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <Button type="link" onClick={() => show_modal(record)}>
                    {text}
                </Button>
            ),
        },
        {
            title: 'Created By',
            dataIndex: 'createdById',
            key: 'createdById',
            render: (text) => {
                const user = users.find((user) => user.userId === text);
                return user ? `${user.firstName} ${user.lastName}` : text;
            },
            filters: users.map(user => ({
                text: `${user.firstName} ${user.lastName}`,
                value: user.userId,
            })),
            onFilter: (value, record) => record.createdById === value,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: get_unique_filters(filtered_tickets, 'status'),
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Assigned To',
            dataIndex: 'assignedTo',
            render: (assignedTo) => {
                const user = users.find(user => user.userId === assignedTo);
                return user ? `${user.firstName} ${user.lastName}` : '-';
            },
        },
        {
            title: 'Date Created',
            dataIndex: 'createdDate',
            key: 'createdDate',
            sorter: (a, b) => moment(b.createdDate).unix() - moment(a.createdDate).unix(),
            defaultSortOrder: 'descend',
            render: (date) => moment(date).format('YYYY-MM-DD'),
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
                        <Title level={4} style={{ margin: 0 }}>Tickkkkkkkkkkkkkket List</Title>
                        <Button onClick={() => toggle_form(!is_form_visible)} className="create-ticket-btn" type="primary">
                            {is_form_visible ? 'Cancel' : 'Create Ticket'}
                        </Button>
                    </div>

                    {/* Cards Row */}
                    <Row gutter={16} style={{ marginBottom: '16px' }}>
                        <Col span={6}>
                            <Card
                                hoverable
                                bordered={false}
                                onClick={() => handle_card_click('Total')}
                                style={{ cursor: 'pointer', backgroundColor: '#e9f5f7' }}
                            >
                                Total Tickets  : {total_tickets}
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                hoverable
                                bordered={false}
                                onClick={() => handle_card_click('Open')}
                                style={{ cursor: 'pointer', backgroundColor: '#e9f5f7' }}
                            >
                                Open Tickets : {open_tickets}
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                hoverable
                                bordered={false}
                                onClick={() => handle_card_click('InProgress')}
                                style={{ cursor: 'pointer', backgroundColor: '#e9f5f7' }}
                            >
                                InProgress Tickets : {in_progress}
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                hoverable
                                bordered={false}
                                onClick={() => handle_card_click('Closed')}
                                style={{ cursor: 'pointer', backgroundColor: '#e9f5f7' }}
                            >
                                Closed Tickets : {Closed_tickets}
                            </Card>
                        </Col>
                    </Row>

                    {tickets_loading ? (
                        <Spin tip="Loading..." />
                    ) : filtered_tickets.length === 0 ? (
                        <Empty description="No Tickets Available" />
                    ) : (
                        <Table
                            dataSource={filtered_tickets}
                            columns={columns}
                            rowKey="ticketId"
                            pagination={false}
                            headerCellStyle={{ backgroundColor: '#007bff', color: '#ffffff' }}
                        />
                    )}

                    {/* Ticket Details Modal */}
                    <TicketDetailsModal
                        visible={is_modal_visible}
                        ticket={selected_ticket}
                        onClose={handle_modal_close}
                        users={users}
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

export default TicketsService;