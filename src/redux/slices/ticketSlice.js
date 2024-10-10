import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const fetchTickets = createAsyncThunk('tickets/fetchTickets', async () => {
    const response = await axios.get('http://localhost:4000/tickets'); // Adjusted endpoint
    // console.log(response.data);
    return response.data;
});

export const fetchTicketDetails = createAsyncThunk('tickets/fetchTicketDetails', async (ticketId) => {
    try {
        const response = await axios.get(`http://localhost:4000/tickets/${ticketId}`); // Use backticks correctly

        if (response.status !== 200) {
            throw new Error('Ticket not found');
        }

        const ticket = response.data;
        // console.log(response.data);
        // console.log(ticket);

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        return ticket;
    } catch (error) {
        console.error(error.message);
        throw error; // Rethrow error to be caught by createAsyncThunk
    }
});


export const createTicket = createAsyncThunk('tickets/addTicket', async (newTicket) => {
    const response = await axios.post('http://localhost:4000/tickets', newTicket);
    
    // Log the response to check the structure
    console.log('Response from createTicket:', response.data);
    
    // Adjust the response to map the id to TicketID
    return {
        id: response.data.id, // Assuming the backend returns an 'id'
        Title: response.data.Title,
        CreatedBy: newTicket.CreatedBy, // Assuming you're passing createdBy in newTicket
        Status: newTicket.Status, // Default status or adjust as needed
        Priority: newTicket.Priority,
        AssignedToID: newTicket.AssignedToID,
        Description: newTicket.Description,
        Remark: response.data.Remark,
        CreatedDate: new Date().toISOString(), // Use current date for CreatedDate
        Chargeability:response.data.Chargeability,
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
                state.error = action.error.message; // Handle error
            });
    },
});

export default ticketSlice.reducer;
