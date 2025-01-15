import React, { useEffect, useState } from 'react';
import { Table, Button, Empty, message, Layout, Typography, Spin, Card, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchTickets, fetchTicketByAssighnedToOrCreatedBy } from '../../redux/slices/ticketSlice';
import { fetchUsers } from '../../redux/slices/userSlice';
import { fetchCustomers } from '../../redux/slices/customerSlice';
import TicketDetailsModal from '../../components/Ticket/TicketDetailsModal';
import CreateTicketModal from '../../components/Ticket/CreateTicketModalForm'; // Import the CreateTicketModal
import moment from 'moment'; // Import moment.js for date formatting
import { useSearchParams } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

const Tickets = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { customers } = useSelector((state) => state.customers);
    const { tickets, loading: tickets_loading, error: tickets_error } = useSelector((state) => state.tickets);
    const { users, loading: users_loading, error: users_error, departments, loading: departments_loading, error: departments_error } = useSelector((state) => state.users);

    const [is_form_visible, toggle_form] = useState(false); // Using state directly for modal
    const [selected_department, set_selected_department] = useState(null);
    const [filtered_users, set_filtered_users] = useState([]);
    const [is_modal_visible, set_is_modal_visible] = useState(false);
    const [selected_ticket, set_selected_ticket] = useState(null);
    const [filtered_tickets, set_filtered_tickets] = useState([]); // State for filtered tickets

    const [searchParams] = useSearchParams();
    const status = searchParams.get('status');
    //   console.log(tickets);

    const user = JSON.parse(localStorage.getItem('user')); // Get user from local storage
    const userId = user?.userId;
    // console.log(user);

    // Redirect if user role is ServiceTechnical
    // useEffect(() => {
    // if (user.userType === 'Normal_User') {
    //     //  if (user && user.role === 'Service_Technical'|| user.role === 'Sales') {
    //     navigate('/ticketsService'); // Navigate to /ticketsService
    // }
    //     }  
    // }, [user, navigate]);

    const fetch_data = async () => {
        if (user?.userType === 'Normal_User') {
            await dispatch(fetchTicketByAssighnedToOrCreatedBy(userId));
        } else {
            if (!tickets || tickets.length === 0) {
                // console.log("ajslkfdjkajskdfjj")
                await dispatch(fetchTickets());
            }
        }
        await dispatch(fetchUsers());
    };


    useEffect(() => {
        fetch_data();
    }, []); // Use location.pathname instead of location
    

    useEffect(() => {
        const fetch_customers = async () => {
            await dispatch(fetchCustomers());
        };
        fetch_customers();
    }, [dispatch]);

    useEffect(() => {
        if (status) {
            const filtered = tickets.filter(ticket => ticket.status === status);
            set_filtered_tickets(filtered);
        } else {
            // const non_closed_tickets = tickets.filter(ticket => ticket.status !== 'Closed');
            const non_closed_tickets = tickets;
            set_filtered_tickets(non_closed_tickets); // Initially, show all non-closed tickets
        }
    }, [tickets, status]);

    // Handle backend error
    // if (tickets_error || users_error || departments_error) {
    //     message.error(`Failed to load data:Please check backend connectivity.`);
    // }

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
    const total_tickets = tickets.length;
    const open_tickets = tickets.filter(ticket => ticket.status === 'Open').length;
    const in_progress = tickets.filter(ticket => ticket.status === 'InProgress').length;
    const Closed_tickets = tickets.filter(ticket => ticket.status === 'Closed').length;

    // Filter tickets based on card click
    const handle_card_click = (status) => {
        if (status === 'Total') {
            set_filtered_tickets(tickets); // Show all tickets
        } else {
            const filtered = tickets.filter(ticket => ticket.status === status);
            set_filtered_tickets(filtered);
        }
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
                return customer ? `${customer.companyName}` : 'Unknown Customer';
            },
            filters: customers.map(customer => ({
                text: `${customer.companyName}`, // Display customer name as filter option
                value: customer.customerId, // Use customerId as filter value
            })),
            onFilter: (value, record) => {
                return record.customerId === value; // Filter by customerId
            },
        },
        {
            title: 'title',
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
                const user = users.find((user) => user.userId === text); // Find user by ID
                return user ? `${user.firstName} ${user.lastName}` : text; // Display user's name or fallback to ID
            },
            filters: users.map(user => ({
                text: `${user.firstName} ${user.lastName}`, // Display user name as filter option
                value: user.userId, // Use userId as filter value
            })),
            onFilter: (value, record) => {
                return record.createdById === value; // Filter by userId
            },
        },
        {
            title: 'status',
            dataIndex: 'status',
            key: 'status',
            filters: get_unique_filters(tickets, 'status'),
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Assighned to',
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
            render: (date) => moment(date).format('DD-MM-YYYY'),
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
    
        // Wait for 0.5 seconds (500ms) before calling fetch_data
        setTimeout(() => {
            fetch_data();
        }, 100); // Delay of 500ms (0.5 seconds)
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

                    {/* Cards Row */}
                    <Row gutter={16} style={{ marginBottom: '16px' }}>
                        <Col span={6}>
                            <Card
                                hoverable
                                bordered={false}
                                onClick={() => handle_card_click('Total')}
                                style={{ cursor: 'pointer', backgroundColor: '#e9f5f7' }} // Add your desired background color
                            >
                                Total Tickets  : {total_tickets}
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                hoverable
                                bordered={false}
                                onClick={() => handle_card_click('Open')}
                                style={{ cursor: 'pointer', backgroundColor: '#e9f5f7' }} // Add your desired background color
                            >
                                Open Tickets : {open_tickets}
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                hoverable
                                bordered={false}
                                onClick={() => handle_card_click('InProgress')}
                                style={{ cursor: 'pointer', backgroundColor: '#e9f5f7' }} // Add your desired background color
                            >
                                InProgress Tickets : {in_progress}
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                hoverable
                                bordered={false}
                                onClick={() => handle_card_click('Closed')}
                                style={{ cursor: 'pointer', backgroundColor: '#e9f5f7' }} // Add your desired background color
                            >
                                Closed Tickets : {Closed_tickets}
                            </Card>
                        </Col>
                    </Row>

                    {tickets_loading || users_loading || departments_loading ? (
                        <Spin tip="Loading tickets..." />
                    ) : filtered_tickets.length === 0 ? (
                        <Empty description="No Tickets Available" />
                    ) : (
                        <Table
                            dataSource={filtered_tickets}
                            columns={columns}
                            rowKey="ticketId" // Ensure each row has a unique key
                            pagination={false}
                            headerCellStyle={{ backgroundColor: '#007bff', color: '#ffffff' }} // Set the background color and text color here
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
                        onClose={() => {
                            toggle_form(false);
                            handle_modal_close();
                        }}
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
