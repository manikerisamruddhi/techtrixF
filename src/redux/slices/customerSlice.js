import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fallback Dummy Data
const dummyCustomers = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '098-765-4321' },
];

// Async Thunks
export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('/api/customers');
        return response.data;
    } catch (error) {
        return rejectWithValue(dummyCustomers); // Return dummy data on failure
    }
});

export const addCustomer = createAsyncThunk('customers/addCustomer', async (newCustomer, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/customers', newCustomer);
        return response.data;
    } catch (error) {
        console.error("Error adding customer:", error);
        return rejectWithValue(null); // No fallback for adding a new customer
    }
});

export const updateCustomer = createAsyncThunk('customers/updateCustomer', async (updatedCustomer, { rejectWithValue }) => {
    try {
        const response = await axios.put(`/api/customers/${updatedCustomer.id}`, updatedCustomer);
        return response.data;
    } catch (error) {
        console.error("Error updating customer:", error);
        return rejectWithValue(null); // No fallback for updating a customer
    }
});

export const deleteCustomer = createAsyncThunk('customers/deleteCustomer', async (customerId, { rejectWithValue }) => {
    try {
        await axios.delete(`/api/customers/${customerId}`);
        return customerId;
    } catch (error) {
        console.error("Error deleting customer:", error);
        return rejectWithValue(null); // No fallback for deleting a customer
    }
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
                state.customers = action.payload || dummyCustomers; // Use dummy data if available
                state.error = action.error.message || "Failed to fetch customers, using dummy data.";
            })
            .addCase(addCustomer.fulfilled, (state, action) => {
                if (action.payload) {
                    state.customers.push(action.payload);
                }
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                if (action.payload) {
                    const updatedCustomer = action.payload;
                    const index = state.customers.findIndex(customer => customer.id === updatedCustomer.id);
                    if (index !== -1) {
                        state.customers[index] = updatedCustomer; // Update the customer in the state
                    }
                }
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                if (action.payload) {
                    const customerId = action.payload;
                    state.customers = state.customers.filter(customer => customer.id !== customerId);
                }
            });
    },
});

// Export the reducer as default
export default customerSlice.reducer;
