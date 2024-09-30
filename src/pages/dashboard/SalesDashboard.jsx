import React, { useEffect, useState } from 'react';
import {useNavigate, useParams } from 'react-router-dom'; // To extract user ID from URL
import { Table, Spin, Empty, Button } from 'antd'; // Ant Design components
import axios from 'axios';

const SalesDashboard = () => {
    const navigate = useNavigate();
    const { userId } = useParams(); // Extracting userId from URL
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get('http://localhost:4000/tickets');
                const assignedTickets = response.data.filter(ticket => ticket.AssignedToID === parseInt(userId));
                setTickets(assignedTickets);
            } catch (error) {
                console.error('Error fetching tickets:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, [userId]);

    // Define Ant Design table columns
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
        },
        {
            title: 'Priority',
            dataIndex: 'Priority',
            key: 'Priority',
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button
                    type="primary"
                    onClick={() => handleProceed(record.TicketID)}
                    disabled={record.Status == 'closed'}
                >
                    Proceed
                </Button>
            ),
        },
    ];

    const handleProceed = (ticketId) => {
        navigate(`/Quotations/create?TicketID=${ticketId}`);
    };


    return (
        <div className="dashboard-container">
            {loading ? (
                <Spin size="large" />
            ) : tickets.length > 0 ? (
                <Table
                    dataSource={tickets}
                    columns={columns}
                    rowKey="TicketID"
                />
            ) : (
                <Empty description="No tickets available" />
            )}
        </div>
    );
};

export default SalesDashboard;
