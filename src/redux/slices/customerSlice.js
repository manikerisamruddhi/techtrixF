import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('http://localhost:4000/customers'); // Adjusted URL
        return response.data; // Assuming the mock API returns an array of customers
    } catch (error) {
        console.error("Error fetching customers:", error);
        return rejectWithValue([]); // Return an empty array on failure
    }
});

export const addCustomer = createAsyncThunk('customers/addCustomer', async (newCustomer, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:4000/customers', newCustomer); // Adjusted URL
        return response.data;
    } catch (error) {
        console.error("Error adding customer:", error);
        return rejectWithValue(null);
    }
});

export const updateCustomer = createAsyncThunk('customers/updateCustomer', async ({ customerId, updatedCustomer }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`http://localhost:4000/customers/${customerId}`, updatedCustomer); // Adjusted URL
        return response.data;
    } catch (error) {
        console.error("Error updating customer:", error);
        return rejectWithValue(null);
    }
});

export const deleteCustomer = createAsyncThunk('customers/deleteCustomer', async (customerId, { rejectWithValue }) => {
    try {
        await axios.delete(`http://localhost:4000/customers/${customerId}`); // Adjusted URL
        return customerId;
    } catch (error) {
        console.error("Error deleting customer:", error);
        return rejectWithValue(null);
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
                state.customers = []; // Use an empty array on failure
                state.error = action.error.message;
            })
            .addCase(addCustomer.fulfilled, (state, action) => {
                if (action.payload) {
                    state.customers.push(action.payload);
                }
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                if (action.payload) {
                    const updatedCustomer = action.payload;
                    const index = state.customers.findIndex(customer => customer.CustomerID === updatedCustomer.CustomerID);
                    if (index !== -1) {
                        state.customers[index] = updatedCustomer; // Update the customer in the state
                    }
                }
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                if (action.payload) {
                    const customerId = action.payload;
                    state.customers = state.customers.filter(customer => customer.CustomerID !== customerId);
                }
            });
    },
});

// Export the reducer as default
export default customerSlice.reducer;
