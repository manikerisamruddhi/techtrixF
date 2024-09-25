import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async () => {
    const response = await axios.get('/api/customers');
    return response.data;
});

export const addCustomer = createAsyncThunk('customers/addCustomer', async (newCustomer) => {
    const response = await axios.post('/api/customers', newCustomer);
    return response.data;
});

// Customer Slice
const customerSlice = createSlice({
    name: 'customers',
    initialState: {
        customers: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.customers = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addCustomer.fulfilled, (state, action) => {
                state.customers.push(action.payload);
            });
    },
});

export default customerSlice.reducer;
