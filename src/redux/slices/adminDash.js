import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import ticketApi from '../../api/ticketApi';


// Define the base URL of your JSON server
const BASE_URL = 'http://localhost:4000';

// Async thunk to fetch tickets
export const fetchTickets = createAsyncThunk('dashboard/fetchTickets', async () => {
    const response = await ticketApi.getAllTickets();
    return response.data;
});

// Async thunk to fetch quotations
export const fetchQuotations = createAsyncThunk('dashboard/fetchQuotations', async () => {
    const response = await axios.get(`${BASE_URL}/quotations`);
    return response.data;
});

// Async thunk to fetch invoices
export const fetchInvoices = createAsyncThunk('dashboard/fetchInvoices', async () => {
    const response = await axios.get(`${BASE_URL}/invoices`);
    return response.data;
});

// Create the slice
const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        tickets: {
            total: 0,
            inProgress: 0,
            resolved: 0,
            closed: 0,
        },
        quotations: {
            delivered: 0,
            remaining: 0,
        },
        invoices: {
            inWarranty: 0,
            outOfWarranty: 0,
        },
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Handle fetching tickets
        builder
            .addCase(fetchTickets.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.tickets = action.payload; // Assuming payload structure matches your state
                state.loading = false;
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        // Handle fetching quotations
        builder
            .addCase(fetchQuotations.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchQuotations.fulfilled, (state, action) => {
                state.quotations = action.payload; // Assuming payload structure matches your state
                state.loading = false;
            })
            .addCase(fetchQuotations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        // Handle fetching invoices
        builder
            .addCase(fetchInvoices.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchInvoices.fulfilled, (state, action) => {
                state.invoices = action.payload; // Assuming payload structure matches your state
                state.loading = false;
            })
            .addCase(fetchInvoices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

// Export the async actions
// export { fetchTickets, fetchQuotations, fetchInvoices };

// Export the reducer
export default dashboardSlice.reducer;