import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const fetchTickets = createAsyncThunk('tickets/fetchTickets', async () => {
    const response = await axios.get('http://localhost:4000/tickets'); // Adjusted endpoint
    return response.data;
});

export const fetchTicketDetails = createAsyncThunk('tickets/fetchTicketDetails', async (ticketId) => {
    // Use query parameter to filter tickets by TicketID
    const response = await axios.get(`http://localhost:4000/tickets?TicketID=${ticketId}`); 
    
    if (response.status !== 200) throw new Error('Ticket not found');
    
    // Assuming the API returns an array, we need to grab the first (and possibly only) ticket
    const ticket = response.data.length > 0 ? response.data[0] : null;
    
    if (!ticket) throw new Error('Ticket not found');
    
    return ticket;
});


export const createTicket = createAsyncThunk('tickets/addTicket', async (newTicket) => {
    const response = await axios.post('http://localhost:4000/tickets', newTicket);
    
    // Log the response to check the structure
    console.log('Response from createTicket:', response.data);
    
    // Adjust the response to map the id to TicketID
    return {
        TicketID: response.data.id, // Assuming the backend returns an 'id'
        Title: response.data.title,
        CreatedBy: newTicket.createdBy, // Assuming you're passing createdBy in newTicket
        Status: 'in-progress', // Default status or adjust as needed
        Priority: newTicket.priority,
        Description: newTicket.description,
        CreatedDate: new Date().toISOString(), // Use current date for CreatedDate
        // Add any other necessary fields here
    };
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
                state.tickets = action.payload;
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createTicket.fulfilled, (state, action) => {
                state.tickets.push(action.payload);
            });
    },
});

export default ticketSlice.reducer;
