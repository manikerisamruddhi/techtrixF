import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTicketDetails } from '../../redux/slices/ticketSlice';
// import TicketThread from './TicketThread';
// import TicketAttachment from './TicketAttachment';
import { useParams } from 'react-router-dom';

const TicketDetails = () => {
    const { ticketId } = useParams();
    const dispatch = useDispatch();
    const { ticket, loading, error } = useSelector((state) => state.tickets);

    useEffect(() => {
        dispatch(fetchTicketDetails(ticketId));
    }, [dispatch, ticketId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading ticket</div>;

    return (
        <div className="ticket-details-container">
            <h1>Ticket Details: {ticket.subject}</h1>
            <p>Status: {ticket.status}</p>
            <p>Created by: {ticket.createdBy}</p>
            <p>Description: {ticket.description}</p>
            {/* <TicketThread ticketId={ticketId} /> */}
            {/* <TicketAttachment ticketId={ticketId} /> */}
        </div>
    );
};

export default TicketDetails;
