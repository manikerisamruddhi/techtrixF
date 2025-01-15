import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import ticketApi from '../../api/ticketApi';

// Async Thunks
export const fetchTickets = createAsyncThunk('tickets/fetchTickets', async () => {
    const response = await ticketApi.getAllTickets(); // Adjusted endpoint
    // console.log('Fetch Tickets Response:', response); // Print fetch tickets response
    return response.data; // Adjusted to return the tickets array
});

// Async Thunks
export const fetchTicketByAssighnedToOrCreatedBy = createAsyncThunk('tickets/fetchTicketByAssighnedToOrCreatedBy', async (userId) => {
    const response = await ticketApi.getTicketByAssighnedToOrCreatedBy(userId); // Adjusted endpoint
    // console.log(response);
    return response.data;
});



export const fetchTicketDetails = createAsyncThunk('tickets/fetchTicketDetails', async (ticketId) => {
    try {
        const response = await ticketApi.getTicketById(ticketId);

        if (response.status !== 200) {
            throw new Error('Ticket not found');
        }

        const ticket = response.data;

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        return ticket;
    } catch (error) {
        // console.error(error.message);
        throw error; // Rethrow error to be caught by createAsyncThunk
    }
});

export const createTicket = createAsyncThunk('tickets/addTicket', async (newTicket) => {
    const response = await ticketApi.createTicket(newTicket);

    return response.data;
});

// Add the updateTicket async thunk
export const updateTicket = createAsyncThunk('tickets/updateTicket', async ({ ticketId, data }) => {
    // console.log(`data recived in update ticket  id = ${ticketId} and data = ${data}`);
    const response = await ticketApi.updateTicket(ticketId, data);
    return response.data;
});

// Ticket Slice
const ticketSlice = createSlice({
    name: 'tickets',
    initialState: {
        tickets: [],
        loading: false,
        error: null,
        ticket: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTickets.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload;
                // console.log('Stored Tickets:', state.tickets); // Print stored tickets
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createTicket.fulfilled, (state, action) => {
                state.tickets.push(action.payload);

            })
            .addCase(fetchTicketDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTicketDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.ticket = action.payload; // Store the ticket data
            })
            .addCase(fetchTicketDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateTicket.fulfilled, (state, action) => {
                const updatedTicket = action.payload;
                const index = state.tickets.findIndex(ticket => ticket.ticketId === updatedTicket.ticketId);
                if (index !== -1) {
                    // Update the ticket in the state
                    state.tickets[index] = updatedTicket;
                }
                // Update the ticket state if the updated ticket is the currently viewed ticket
                if (state.ticket && state.ticket.ticketId === updatedTicket.ticketId) {
                    state.ticket = updatedTicket;
                }
                console.log('Updated Ticket:', updatedTicket);
                console.log('Updated Tickets:', state.tickets); // Log state.tickets
            })
            // Builder for fetchTicketByAssighnedToOrCreatedBy
            .addCase(fetchTicketByAssighnedToOrCreatedBy.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTicketByAssighnedToOrCreatedBy.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload; // Update tickets with the filtered data
            })
            .addCase(fetchTicketByAssighnedToOrCreatedBy.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default ticketSlice.reducer;