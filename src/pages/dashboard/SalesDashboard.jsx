import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // To extract user ID from URL
import { Table, Spin, Empty, Button, message } from 'antd'; // Ant Design components
import axios from 'axios';
import QuotationFormModal from '../../components/Sales/QuotationFormModal'; // Import the new modal component

const SalesDashboard = () => {
    const navigate = useNavigate();
    const { userId } = useParams(); // Extracting userId from URL
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);

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
                    onClick={() => showModal(record.TicketID)}
                    disabled={record.Status === 'closed'}
                >
                    Proceed
                </Button>
            ),
        },
    ];

    const showModal = (ticketId) => {
        setSelectedTicketId(ticketId);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedTicketId(null);
    };

    const handleQuotationSubmit = async (quotationData) => {
        try {
            // Assuming you have a POST endpoint for creating quotations
            await axios.post('http://localhost:4000/quotations', quotationData);
            message.success('Quotation created successfully!');
            handleModalClose(); // Close the modal after submission
        } catch (error) {
            console.error('Error creating quotation:', error);
            message.error('Failed to create quotation. Please try again.');
        }
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

            {/* Quotation Form Modal */}
            <QuotationFormModal
                visible={isModalVisible}
                onClose={handleModalClose}
                ticketId={selectedTicketId}
                onSubmit={handleQuotationSubmit}
            />
        </div>
    );
};

export default SalesDashboard;
