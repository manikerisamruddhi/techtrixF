import React, { useEffect } from 'react';
import { Table, Button, Empty, message, Form, Input, Select } from 'antd'; // Antd components for better UI
import Navbar from '../../components/Navbar/AdminNav';
import '../../styles/Pages/Ticket/TicketList.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets } from '../../redux/slices/ticketSlice'; // Adjust path if necessary
import { Link } from 'react-router-dom';
import useToggle from '../../hooks/useCreateTicket'; // Import the custom hook

const { Option } = Select;

const TicketList = () => {
    const dispatch = useDispatch();
    const { tickets, loading, error } = useSelector((state) => state.tickets);

    const [isFormVisible, toggleForm] = useToggle(false); // Use custom hook for toggle

    useEffect(() => {
        dispatch(fetchTickets());
    }, [dispatch]);

    // Handle backend error
    if (error) {
        message.error(`Failed to load tickets: ${error}. Please check backend connectivity.`);
    }

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
                <Link to={`/ticket/${record.TicketID}`}>{text}</Link>
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
                <Link to={`/ticket/${record.TicketID}`}>
                    <Button type="primary">View</Button>
                </Link>
            ),
        },
    ];

    // Form submit handler
    const onFinish = (values) => {
        console.log('Form Values:', values);
        // Handle ticket creation logic here
        toggleForm(); // Hide form after submission
    };

    return (
        <div className="main-container">
            <Navbar />
            <div className="content-container">
                <h1>Tickets</h1>
                <Button onClick={toggleForm} className="create-ticket-btn" type="primary">
                    {isFormVisible ? 'Cancel' : 'Create Ticket'}
                </Button>

                {/* Conditionally render the form below the button */}
                {isFormVisible && (
                    <Form
                        layout="vertical"
                        onFinish={onFinish}
                        className="create-ticket-form"
                        style={{ marginTop: '20px' }} // Add margin to separate the form from the button
                    >
                        <Form.Item
                            name="title"
                            label="Title"
                            rules={[{ required: true, message: 'Please enter the ticket title' }]}
                        >
                            <Input placeholder="Enter ticket title" />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'Please enter the description' }]}
                        >
                            <Input.TextArea rows={4} placeholder="Enter ticket description" />
                        </Form.Item>
                        <Form.Item
                            name="priority"
                            label="Priority"
                            rules={[{ required: true, message: 'Please select priority' }]}
                        >
                            <Select placeholder="Select priority">
                                <Option value="Low">Low</Option>
                                <Option value="Medium">Medium</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit Ticket
                            </Button>
                        </Form.Item>
                    </Form>
                )}

                {/* Display loading spinner when fetching data */}
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>Error loading tickets: {error}</div>
                ) : tickets.length === 0 ? (
                    // Show Empty component when no tickets are available
                    <div>
                        <Empty description="No Tickets Available" />
                    </div>
                ) : (
                    <Table
                        dataSource={tickets}
                        columns={columns}
                        rowKey="TicketID"
                        pagination={false}
                    />
                )}
            </div>
        </div>
    );
};

export default TicketList;
