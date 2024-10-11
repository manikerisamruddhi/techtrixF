import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Table, Spin, Empty, Button, message } from 'antd';
import axios from 'axios';
import QuotationFormModal from './QuotationFormModal';
import TicketDetailsModal from '../../components/Ticket/TicketDetailsModal';
import AssignToModal from './AssignToModal'; // Import the new modal component

const SalesTickets = () => {
    const navigate = useNavigate();
    const { userId } = useParams(); // Get user ID from URL
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isTicketModalVisible, setIsTicketModalVisible] = useState(false);
    const [isAssignToModalVisible, setIsAssignToModalVisible] = useState(false); // New state for AssignToModal
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [selectedTicketDetails, setSelectedTicketDetails] = useState(null);

    // Fetch tickets assigned to the logged-in sales user
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

    // Table columns
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
                <>
                    {record.Status === 'Open' && (
                        <Button
                            type="primary"
                            onClick={() => showModal(record.TicketID)}
                            style={{ marginRight: 8 }}
                        >
                            Proceed
                        </Button>
                    )}
                    
                    {record.Status === 'in-progress' && (
                        <Button
                            type="default"
                            onClick={() => showAssignToModal(record.TicketID)} // Open the AssignTo modal
                            style={{ marginRight: 8 }}
                        >
                            Assign To
                        </Button>
                    )}
                    
                    <Button
                        type="default"
                        onClick={() => showTicketModal(record)}
                    >
                        View
                    </Button>
                </>
            ),
        },
    ];

    // Show QuotationFormModal
    const showModal = (ticketId) => {
        setSelectedTicketId(ticketId);
        setIsModalVisible(true);
    };

    // Show TicketDetailsModal
    const showTicketModal = (ticket) => {
        setSelectedTicketId(ticket.TicketID);
        setSelectedTicketDetails(ticket);
        setIsTicketModalVisible(true);
    };

    // Show AssignToModal
    const showAssignToModal = (ticketId) => {
        setSelectedTicketId(ticketId);
        setIsAssignToModalVisible(true); // Open the AssignTo modal
    };

    // Close QuotationFormModal
    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedTicketId(null);
    };

    // Close TicketDetailsModal
    const handleTicketModalClose = () => {
        setIsTicketModalVisible(false);
        setSelectedTicketDetails(null);
    };

    // Close AssignToModal
    const handleAssignToModalClose = () => {
        setIsAssignToModalVisible(false); // Close the AssignTo modal
    };

    // Handle Quotation submission and update the ticket's status
    const handleQuotationSubmit = async (quotationData) => {
        try {
            const response = await axios.get(`http://localhost:4000/tickets?TicketID=${selectedTicketId}`);
            const ticket = response.data[0];

            if (ticket) {
                await axios.post('http://localhost:4000/quotations', quotationData);
                await axios.patch(`http://localhost:4000/tickets/${ticket.id}`, { Status: 'in-progress', CreatedBy: 'Sales' });
              
                // Update tickets state to reflect new status
                setTickets(prevTickets => prevTickets.map(t =>
                    t.TicketID === selectedTicketId ? { ...t, Status: 'in-progress' } : t
                ));

                message.success('Quotation created successfully and ticket status updated to in-progress!');
                handleModalClose();
            } else {
                message.error('Ticket not found. Please try again.');
            }
        } catch (error) {
            console.error('Error creating quotation or updating ticket status:', error);
            message.error('Failed to create quotation or update ticket status. Please try again.');
        }
    };

    // Handle ticket assignment to a user from logistics
    const handleAssignTo = async (ticketId, userId) => {
        await axios.patch(`http://localhost:4000/tickets/${ticket.id}`);
        const idd = response.id;
        //console.log('Assigning to Ticket ID:', idd, 'User ID:', userId);
        try {
            const response = await axios.patch(`http://localhost:4000/tickets/${idd}`, { AssignedToID: userId });
           
            //console.log('API Response:', response.data); // Log the response

            // Update tickets state to reflect the assigned user
            setTickets(prevTickets => prevTickets.map(t =>
                t.TicketID === ticketId ? { ...t, AssignedToID: userId, Status: 'in-progress' } : t
            ));

            message.success('Ticket assigned successfully!');
            handleAssignToModalClose(); // Close the AssignTo modal
        } catch (error) {
            console.error('Error assigning ticket:', error);
            message.error('Failed to assign ticket. Please try again.');
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
                <Empty description="No Tickets Available" />
            )}
            <QuotationFormModal
                visible={isModalVisible}
                onClose={handleModalClose}
                ticketId={selectedTicketId}
                onSubmit={handleQuotationSubmit}
            />
            <TicketDetailsModal
                visible={isTicketModalVisible}
                onClose={handleTicketModalClose}
                ticketDetails={selectedTicketDetails}
            />
            <AssignToModal
                visible={isAssignToModalVisible}
                onClose={handleAssignToModalClose}
                ticketId={selectedTicketId}
                onAssign={handleAssignTo} // Pass handleAssignTo to AssignToModal
            />
        </div>
    );
};

export default SalesTickets;
