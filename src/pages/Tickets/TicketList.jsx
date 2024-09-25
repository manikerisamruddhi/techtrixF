import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets } from '../../redux/slices/ticketSlice';
import { Link } from 'react-router-dom';

const TicketList = () => {
    const dispatch = useDispatch();
    const { tickets, loading, error } = useSelector((state) => state.tickets);

    useEffect(() => {
        dispatch(fetchTickets());
    }, [dispatch]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading tickets</div>;

    return (
        <div className="ticket-list-container">
            <h1>Tickets</h1>
            <Link to="/create-ticket" className="create-ticket-btn">Create Ticket</Link>
            <ul>
                {tickets.map(ticket => (
                    <li key={ticket.id}>
                        <Link to={`/ticket/${ticket.id}`}>
                            {ticket.subject} - Status: {ticket.status}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TicketList;
