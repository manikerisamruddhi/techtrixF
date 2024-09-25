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

// New Async Thunk: Update Customer
export const updateCustomer = createAsyncThunk('customers/updateCustomer', async (updatedCustomer) => {
    const response = await axios.put(`/api/customers/${updatedCustomer.id}`, updatedCustomer);
    return response.data; // Return the updated customer data
});

// New Async Thunk: Delete Customer
export const deleteCustomer = createAsyncThunk('customers/deleteCustomer', async (customerId) => {
    await axios.delete(`/api/customers/${customerId}`);
    return customerId; // Return the ID for the reducer to use
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
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                const updatedCustomer = action.payload;
                const index = state.customers.findIndex(customer => customer.id === updatedCustomer.id);
                if (index !== -1) {
                    state.customers[index] = updatedCustomer; // Update the customer in the state
                }
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                const customerId = action.payload;
                state.customers = state.customers.filter(customer => customer.id !== customerId);
            });
    },
});

// Export the reducer as default
export default customerSlice.reducer;

