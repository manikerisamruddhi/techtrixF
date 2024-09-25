import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const fetchTickets = createAsyncThunk('tickets/fetchTickets', async () => {
    const response = await axios.get('/api/tickets');
    return response.data;
});

export const addTicket = createAsyncThunk('tickets/addTicket', async (newTicket) => {
    const response = await axios.post('/api/tickets', newTicket);
    return response.data;
});

// Ticket Slice
const ticketSlice = createSlice({
    name: 'tickets',
    initialState: {
        tickets: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTickets.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tickets = action.payload;
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addTicket.fulfilled, (state, action) => {
                state.tickets.push(action.payload);
            });
    },
});

export default ticketSlice.reducer;
