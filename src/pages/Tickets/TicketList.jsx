import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Async Thunk for fetching tickets
export const fetchTickets = createAsyncThunk('tickets/fetchTickets', async () => {
    const response = await axios.get('/api/tickets'); // Adjust the endpoint as necessary
    console.log('API Response:', response.data); // Inspect the response data
    return response.data; // Adjust this line if needed
});

// Ticket Slice
const ticketSlice = createSlice({
    name: 'tickets',
    initialState: {
        tickets: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTickets.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload; // Store fetched tickets
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // Capture error
            });
    },
});

// Export the reducer
export const ticketReducer = ticketSlice.reducer;

// Ticket List Component
const TicketList = () => {
    const dispatch = useDispatch();
    const { tickets, loading, error } = useSelector((state) => state.tickets);

    useEffect(() => {
        dispatch(fetchTickets());
    }, [dispatch]);

    console.log(tickets); // Inspect fetched data

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading tickets</div>;

    return (
        <div className="ticket-list-container">
            <h1>Tickets</h1>
            <Link to="/create-ticket" className="create-ticket-btn">Create Ticket</Link>
            <ul>
                {Array.isArray(tickets) && tickets.length > 0 ? (
                    tickets.map(ticket => (
                        <li key={ticket.id}>
                            <Link to={`/ticket/${ticket.id}`}>
                                {ticket.subject} - Status: {ticket.status}
                            </Link>
                        </li>
                    ))
                ) : (
                    <li>No tickets available.</li> 
                )}

            </ul>
        </div>
    );
};

export default TicketList;
