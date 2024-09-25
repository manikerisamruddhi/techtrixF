import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const fetchInvoices = createAsyncThunk('invoices/fetchInvoices', async () => {
    const response = await axios.get('/api/invoices');
    return response.data;
});

export const addInvoice = createAsyncThunk('invoices/addInvoice', async (newInvoice) => {
    const response = await axios.post('/api/invoices', newInvoice);
    return response.data;
});

// Invoice Slice
const invoiceSlice = createSlice({
    name: 'invoices',
    initialState: {
        invoices: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInvoices.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchInvoices.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.invoices = action.payload;
            })
            .addCase(fetchInvoices.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addInvoice.fulfilled, (state, action) => {
                state.invoices.push(action.payload);
            });
    },
});

export default invoiceSlice.reducer;
