// TicketDetails.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTicketDetails } from '../../redux/slices/ticketSlice';
import { useParams } from 'react-router-dom';
import { Card, Spin, Typography, message } from 'antd';

const { Title, Paragraph } = Typography;

const TicketDetails = () => {
    const { ticketId } = useParams(); // Extract ticketId from URL
    const dispatch = useDispatch();
    
    const { ticket, loading, error } = useSelector((state) => ({
        ticket: state.tickets.ticket,
        loading: state.tickets.loading,
        error: state.tickets.error,
    }));

    useEffect(() => {
        dispatch(fetchTicketDetails(ticketId)); // Dispatch the action to fetch ticket details
    }, [dispatch, ticketId]);

    if (loading) return <Spin tip="Loading ticket details..." />;
    if (error) {
        message.error(`Error loading ticket: ${error}`);
        return <div>Error loading ticket: {error}</div>;
    }
    if (!ticket) return <div>No ticket details available</div>;

    return (
        <Card title="Ticket Details" style={{ width: '100%', maxWidth: 600, margin: 'auto' }}>
            <Title level={4}>{ticket.Title}</Title>
            <Paragraph><strong>Status:</strong> {ticket.Status}</Paragraph>
            <Paragraph><strong>Created by:</strong> {ticket.CreatedBy}</Paragraph>
            <Paragraph><strong>Description:</strong> {ticket.Description}</Paragraph>
            <Paragraph><strong>Priority:</strong> {ticket.Priority}</Paragraph>
            <Paragraph><strong>Category:</strong> {ticket.Category}</Paragraph>
            <Paragraph><strong>Created Date:</strong> {new Date(ticket.CreatedDate).toLocaleString()}</Paragraph>
            <Paragraph><strong>Resolved:</strong> {ticket.IsResolved ? 'Yes' : 'No'}</Paragraph>
            <Paragraph><strong>Assigned To ID:</strong> {ticket.AssignedToID}</Paragraph>
            <Paragraph><strong>Customer ID:</strong> {ticket.CustomerID}</Paragraph>
        </Card>
    );
};

export default TicketDetails;
